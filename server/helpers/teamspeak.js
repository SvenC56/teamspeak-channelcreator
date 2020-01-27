const { TeamSpeak } = require('ts3-nodejs-library')
const compare = require('./compare')
const logger = require('./winston')

class TeamSpeakServer {
  constructor(config) {
    if (TeamSpeakServer.instance instanceof TeamSpeakServer) {
      return TeamSpeakServer.instance
    }

    this.ts = TeamSpeak
    this.config = config
    this.name = config.nickname
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
      message: `${this.name} - Connecting to Teamspeak`
    })

    try {
      this.ts = await TeamSpeak.connect(this.config)
    } catch (e) {
      throw new Error(`Can't connect to TeamSpeak.`)
    }

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
        level: 'info',
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

    this.ts.on('clientdisconnect', async (event) => {
      await compare.compareChannels()
    })
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
      let data = null
      try {
        data = await this.ts.channelList()
      } catch (error) {
        throw new Error(error)
      }
      return data
    }
  }

  async getSubchannels(cid) {
    if (this.getState()) {
      let data = null
      try {
        data = await this.ts.channelList({ pid: cid })
      } catch (error) {
        throw new Error(error)
      }
      return data
    }
  }

  async createChannel(name, properties) {
    if (this.getState()) {
      let data = null
      try {
        data = await this.ts.channelCreate(name, properties)
      } catch (error) {
        throw new Error(error)
      }
      return data
    }
  }

  async deleteChannel(cid, force) {
    if (this.getState()) {
      let data = null
      try {
        data = await this.ts.channelDelete(cid, force)
      } catch (error) {
        throw new Error(error)
      }
      return data
    }
  }
}

module.exports = TeamSpeakServer
