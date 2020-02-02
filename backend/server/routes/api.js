const express = require('express')
const router = express.Router()
const Database = require('../utils/database')
const compare = require('../utils/compare')
const TeamSpeakServer = require('../utils/teamspeak')
const teamspeakConfig = require('../utils/teamspeakConfig')

const teamspeakServer = new TeamSpeakServer(teamspeakConfig)
const database = new Database()

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
    const response = teamspeakServer.getWhoami()
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
