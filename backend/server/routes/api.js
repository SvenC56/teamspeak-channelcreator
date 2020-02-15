import express from 'express'
import { pick } from 'lodash'
import { celebrate, Segments } from 'celebrate'
import Database from '../utils/database'
import compare from '../utils/compare'
import TeamSpeakServer from '../utils/teamspeak'
import {
  getSingleSchema,
  createSchema,
  deleteSchema,
  updateSchema
} from '../utils/validationSchema'

const router = express.Router()
const teamspeakServer = new TeamSpeakServer()
const database = new Database()

router.get('/healthcheck', async (req, res, next) => {
  try {
    const response = {
      server: 'up',
      teamspeak: teamspeakServer.getState()
    }
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get(
  '/channelsync',
  celebrate({
    [Segments.BODY]: getSingleSchema
  }),
  async (req, res, next) => {
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
  }
)

router.post(
  '/channelsync',
  celebrate({
    [Segments.BODY]: createSchema
  }),
  async (req, res, next) => {
    try {
      const data = pick(req.body, [
        parent,
        prefix,
        minChannel,
        maxUsers,
        codec,
        quality,
        joinPower,
        topic,
        description
      ])
      const response = await database.createChannelSync(data)
      await res.status(200).json(response)
    } catch (e) {
      next(e)
    }
  }
)

router.delete(
  '/channelsync',
  celebrate({
    [Segments.BODY]: deleteSchema
  }),
  async (req, res, next) => {
    try {
      const response = await database.deleteChannelSync(req.body.id)
      await res.status(200).json(response)
    } catch (e) {
      next(e)
    }
  }
)

router.patch(
  '/channelsync',
  celebrate({
    [Segments.BODY]: updateSchema
  }),
  async (req, res, next) => {
    try {
      const data = (({
        id,
        parent,
        prefix,
        minChannel,
        maxUsers,
        codec,
        quality,
        joinPower,
        topic,
        description
      }) => ({
        id,
        parent,
        prefix,
        minChannel,
        maxUsers,
        codec,
        quality,
        joinPower,
        topic,
        description
      }))(req.body)
      const response = await database.updateChannelSync(data)
      await res.status(200).json(response)
    } catch (e) {
      next(e)
    }
  }
)

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
