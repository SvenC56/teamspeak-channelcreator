import Database from './database'
import TeamSpeakServer from './teamspeak'
import logger from './winston'

const teamspeakServer = new TeamSpeakServer()
const database = new Database()

exports.compareChannels = async () => {
  const syncChannels = await database.readAllChannelSync()

  const { toCreate, toDelete } = await checkAllChannels(syncChannels)

  if (toCreate.length > 0) {
    await createChannels(toCreate)
  }

  if (toDelete.length > 0) {
    await deleteChannels(toDelete)
  }

  return
}

async function createChannels(toCreate) {
  for (let element of toCreate) {
    const properties = {
      cpid: element.parent,
      channel_codec: element.codec,
      channel_codec_quality: element.quality,
      channel_flag_permanent: 1,
      channel_topic: element.topic,
      channel_description: element.description,
      channel_maxclients: element.maxUsers,
      channel_flag_maxclients_unlimited: element.maxUsers === 0 ? 1 : 0,
    }
    const perms = [
      { name: 'i_channel_needed_join_power', value: element.joinPower },
      { name: 'i_channel_needed_modify_power', value: 75 },
    ]
    try {
      await teamspeakServer.createChannel(
        element.channel_name,
        properties,
        perms
      )
      logger.log({
        level: 'info',
        message: `Create channel '${element.channel_name}' with Parent ID: ${element.parent}`,
      })
    } catch (error) {
      logger.log({
        level: 'error',
        message: error,
      })
    }
  }
}

async function deleteChannels(toDelete) {
  for (let element of toDelete) {
    try {
      await teamspeakServer.deleteChannel(element[0].cid, 0)
      logger.log({
        level: 'info',
        message: `Delete channel '${element[0].channel_name}' with Parent ID: ${element[0].pid}`,
      })
    } catch (error) {
      logger.log({
        level: 'error',
        message: error,
      })
    }
  }
}

async function checkAllChannels(syncChannels) {
  let filteredChannels = []
  let toCreate = []
  let toDelete = []

  for (let element of syncChannels) {
    try {
      filteredChannels = await teamspeakServer.getSubchannels(element.parent)
      filteredChannels = filteredChannels.map((channel) => ({
        ...channel.propcache,
      }))
    } catch (error) {
      logger.log({
        level: 'error',
        message: error,
      })
    }

    let i = 0
    for (let channel of filteredChannels) {
      if (channel.total_clients > 0) {
        i++
      }
    }
    // Sort channels in correct order
    // sortChannels(filteredChannels)
    if (i === filteredChannels.length - 1) {
      // keep these channels
    } else if (i === filteredChannels.length) {
      // create new channels
      let channel = null
      if (filteredChannels[filteredChannels.length - 1]) {
        const highestChannelNumber = getChannelNumber(filteredChannels)
        channel = {
          channel_name: `${element.prefix} ${highestChannelNumber + 1}`,
          ...element,
        }
        toCreate.push(channel)
      } else {
        channel = {
          channel_name: `${element.prefix} 1`,
          ...element,
        }
        toCreate.push(channel)
      }
    } else {
      const markDelete = filteredChannels.filter((x) => x.total_clients === 0)
      // Remove first element
      markDelete.shift()
      toDelete.push(markDelete)
    }
  }
  return { toCreate, toDelete }
}

function sortChannels(channels) {
  return channels.sort((a, b) => {
    // Strip chars from string
    const keyA = a.channel_name.match(/\d+$/)
    const keyB = b.channel_name.match(/\d+$/)
    return parseInt(keyA) - parseInt(keyB)
  })
}

function getChannelNumber(channels) {
  const numbers = channels.map((channel) =>
    parseInt(channel.channel_name.match(/\d+$/))
  )
  return Math.max(...numbers)
}
