const express = require('express')
const router = express.Router()
require('dotenv').config()
const { QueryProtocol } = require('ts3-nodejs-library')
const database = require('./../helpers/database')
const compare = require('./../helpers/compare')
const TeamSpeakServer = require('./../helpers/teamspeak')
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

router.get('/channelsync', async (req, res, next) => {
  try {
    let response = null
    if (req.body.id) {
      response = await database.readSingleChannelSync(req.body.id)
    } else {
      response = await database.readAllChannelSync()
    }
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.post('/channelsync', async (req, res, next) => {
  try {
    const response = await database.createChannelSync(req.body.data)
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.delete('/channelsync', async (req, res, next) => {
  try {
    const response = await database.deleteChannelSync(req.body.id)
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.patch('/channelsync', async (req, res, next) => {
  try {
    const response = await database.updateChannelSync(req.body.data)
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get('/teamspeak/whoami', async (req, res, next) => {
  try {
    const response = await teamspeakServer.whoami
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get('/teamspeak/channels', async (req, res, next) => {
  try {
    const response = await teamspeakServer.getChannels()
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.post('/teamspeak/channel', async (req, res, next) => {
  try {
    const response = await teamspeakServer.createChannel()
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get('/channelsync/trigger', async (req, res, next) => {
  try {
    const response = await compare.compareChannels()
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

module.exports = router
