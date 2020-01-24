require('dotenv').config()
const { QueryProtocol } = require('ts3-nodejs-library')
const database = require('./database')
const TeamSpeakServer = require('./../helpers/teamspeak')
const logger = require('./winston')
const teamspeakConfig = {
  username: process.env.TEAMSPEAK_USERNAME
    ? process.env.TEAMSPEAK_USERNAME
    : 'serveradmin',
  password: process.env.TEAMSPEAK_PASSWORD
    ? process.env.TEAMSPEAK_PASSWORD
    : 'password',
  host: process.env.TEAMSPEAK_HOST ? process.env.TEAMSPEAK_HOST : 'localhost',
  serverport: process.env.TEAMSPEAK_SERVER_PORT
    ? process.env.TEAMSPEAK_SERVER_PORT
    : 9987,
  queryport: process.env.TEAMSPEAK_QUERY_PORT
    ? process.env.TEAMSPEAK_QUERY_PORT
    : 10011,
  protocol:
    process.env.TEAMSPEAK_PROTOCOL.toLowerCase() === 'ssh'
      ? QueryProtocol.SSH
      : QueryProtocol.RAW,
  nickname: process.env.TEAMSPEAK_BOT_NAME
    ? process.env.TEAMSPEAK_BOT_NAME
    : 'Bot',
  keepAlive: true
}

const teamspeakServer = new TeamSpeakServer(teamspeakConfig)

exports.compareChannels = async () => {
  if (teamspeakServer.teamspeakReady) {
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
        channel_codec: element.codec,
        cpid: element.parent,
        channel_flag_permanent: 1
      }
      // const options = {
      //   channel_codec: element.codec,
      //   channel_codec_quality: element.quality,
      //   channel_cpid: element.parent,
      //   channel_description: element.description,
      //   channel_topic: element.topic,
      //   channel_flag_maxclients_unlimited: element.maxUsers,
      //   channel_flag_permanent: 1
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
  } else {
    return false
  }
}

function sortChannels(channels) {
  return channels.sort((a, b) => {
    // Strip chars from string
    const keyA = a.propcache.channel_name.match(/\d+$/)
    const keyB = b.propcache.channel_name.match(/\d+$/)
    return parseInt(keyA) - parseInt(keyB)
  })
}
