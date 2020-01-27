require('dotenv').config()
const database = require('./database')
const TeamSpeakServer = require('./teamspeak')
const logger = require('./winston')
const teamspeakConfig = require('./teamspeakConfig')

const teamspeakServer = new TeamSpeakServer(teamspeakConfig)

exports.compareChannels = async () => {
  const syncChannels = await database.readAllChannelSync()
  // eslint-disable-next-line prefer-const
  let filteredChannels = []
  // eslint-disable-next-line prefer-const
  let toCreate = []
  // eslint-disable-next-line prefer-const
  let toDelete = []

  // eslint-disable-next-line prefer-const
  for (let element of syncChannels) {
    try {
      filteredChannels = await teamspeakServer.getSubchannels(element.parent)
    } catch (error) {
      throw new Error(error)
    }

    let i = 0
    // eslint-disable-next-line prefer-const
    for (let channel of filteredChannels) {
      if (channel.propcache.total_clients > 0) {
        i++
      }
    }
    // Sort channels in correct order
    sortChannels(filteredChannels)
    if (i === filteredChannels.length - 1) {
      // keep these channels
      // console.log('keep channels')
    } else if (i === filteredChannels.length) {
      // create new channels
      // console.log('create channels')
      let channel = null
      if (filteredChannels[filteredChannels.length - 1]) {
        const highestChannelInt = parseInt(
          filteredChannels[
            filteredChannels.length - 1
          ].propcache.channel_name.match(/\d+$/)
        )
        channel = {
          channel_name: `${element.prefix} ${highestChannelInt + 1}`,
          ...element
        }
        toCreate.push(channel)
      } else {
        channel = {
          channel_name: `${element.prefix} 1`,
          ...element
        }
        toCreate.push(channel)
      }
    } else {
      // these these channels
      // console.log('delete channels')
      const markDelete = filteredChannels.filter(
        (x) => x.propcache.total_clients === 0
      )
      // Remove first element
      markDelete.shift()
      toDelete.push(markDelete)
    }
  }
  // eslint-disable-next-line prefer-const
  for (let element of toCreate) {
    const options = {
      cpid: element.parent,
      channel_codec: element.codec,
      channel_codec_quality: element.quality,
      channel_flag_permanent: 1,
      channel_topic: element.topic,
      channel_description: element.description
    }
    // const options = {
    //   channel_flag_maxclients_unlimited: element.maxUsers,
    // }
    try {
      await teamspeakServer.createChannel(element.channel_name, options)
    } catch (error) {
      throw new Error(error)
    }
    logger.log({
      level: 'info',
      message: `Create channel '${element.channel_name}' with Parent ID: ${element.parent}`
    })
  }
  // eslint-disable-next-line prefer-const
  for (let element of toDelete) {
    try {
      await teamspeakServer.deleteChannel(element[0].propcache.cid, 0)
    } catch (error) {
      throw new Error(error)
    }
    logger.log({
      level: 'info',
      message: `Delete channel '${element[0].propcache.channel_name}' with Parent ID: ${element[0].propcache.pid}`
    })
  }
  return toCreate
}

function sortChannels(channels) {
  return channels.sort((a, b) => {
    // Strip chars from string
    const keyA = a.propcache.channel_name.match(/\d+$/)
    const keyB = b.propcache.channel_name.match(/\d+$/)
    return parseInt(keyA) - parseInt(keyB)
  })
}
