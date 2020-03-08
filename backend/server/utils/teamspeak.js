import { TeamSpeak } from 'ts3-nodejs-library'
import teamspeakConfig from './teamspeakConfig'
import compare from './compare'
import logger from './winston'

class TeamSpeakServer {
  constructor() {
    if (TeamSpeakServer.instance instanceof TeamSpeakServer) {
      return TeamSpeakServer.instance
    }

    this.ts = TeamSpeak
    this.config = teamspeakConfig
    this.name = teamspeakConfig.nickname
    this.whoami = null
    this.teamspeakReady = false
    this.init()

    // Singleton
    // Object.freeze(this)
    TeamSpeakServer.instance = this
  }

  async init() {
    logger.log({
      level: 'info',
      message: `${this.name} - Connecting to TeamSpeak server...`
    })

    try {
      this.ts = await TeamSpeak.connect(this.config)
    } catch (e) {
      logger.log({
        level: 'error',
        message: e.message
      })
      return
    }

    logger.log({
      level: 'info',
      message: `${this.name} - Successfully connected to TeamSpeak server.`
    })

    this.setState(true)

    this.whoami = await this.ts.whoami()

    await Promise.all([
      this.ts.registerEvent('server'),
      this.ts.registerEvent('channel', 0),
      this.ts.registerEvent('textserver'),
      this.ts.registerEvent('textchannel'),
      this.ts.registerEvent('textprivate')
    ])

    this.ts.on('close', async () => {
      this.setState(false)
      logger.log({
        level: 'error',
        message: `Connection lost. Reconnecting...`
      })
      await this.ts.reconnect(-1, 1000)
      logger.log({
        level: 'info',
        message: `Connection established.`
      })
      this.setState(true)
    })

    this.ts.on('clientmoved', async (event) => {
      await compare.compareChannels()
    })

    this.ts.on('clientdisconnect', async () => {
      await compare.compareChannels()
    })

    this.ts.on('error', (e) =>
      logger.log({
        level: 'error',
        message: e.message
      })
    )
  }

  setState(state) {
    this.teamspeakReady = state
  }

  getState() {
    return this.teamspeakReady
  }

  getWhoami() {
    return this.whoami
  }

  async getChannels() {
    if (this.getState()) {
      try {
        return await this.ts.channelList()
      } catch (error) {
        logger.log({
          level: 'error',
          message: error
        })
      }
    }
  }

  async getSubchannels(cid) {
    if (this.getState()) {
      try {
        return await this.ts.channelList({ pid: cid })
      } catch (error) {
        logger.log({
          level: 'error',
          message: error
        })
      }
    }
  }

  async createChannel(name, properties, perms) {
    if (this.getState()) {
      try {
        let channel = await this.ts.channelCreate(name, properties)
        for (let perm of perms) {
          await channel.setPerm(perm.name, perm.value)
        }
      } catch (error) {
        logger.log({
          level: 'error',
          message: error
        })
      }
    }
  }

  async deleteChannel(cid, force) {
    if (this.getState()) {
      try {
        return await this.ts.channelDelete(cid, force)
      } catch (error) {
        logger.log({
          level: 'error',
          message: error
        })
      }
    }
  }
}

module.exports = TeamSpeakServer
