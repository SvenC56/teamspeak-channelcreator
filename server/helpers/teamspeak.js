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
    this.whoami = null
    this.teamspeakReady = false
    this.init()
    TeamSpeakServer.instance = this
  }

  async init() {
    try {
      this.ts = await TeamSpeak.connect(this.config)
    } catch (e) {
      throw new Error(`Can't connect to TeamSpeak.`)
    }

    this.teamspeakReady = true

    this.whoami = await this.ts.whoami()

    await Promise.all([
      this.ts.registerEvent('server'),
      this.ts.registerEvent('channel', 0),
      this.ts.registerEvent('textserver'),
      this.ts.registerEvent('textchannel'),
      this.ts.registerEvent('textprivate')
    ])

    this.ts.on('close', async () => {
      this.teamspeakReady = false
      logger.log({
        level: 'info',
        message: `Connection lost. Reconnecting...`
      })
      await this.ts.reconnect(-1, 1000)
      logger.log({
        level: 'info',
        message: `Connection established.`
      })
      this.teamspeakReady = true
    })
    this.ts.on('clientmoved', async (event) => {
      await compare.compareChannels()
    })
    this.ts.on('clientdisconnect', async (event) => {
      await compare.compareChannels()
    })
  }

  async getChannels() {
    let data = null
    try {
      data = await this.ts.channelList()
    } catch (error) {
      throw new Error(error)
    }
    return data
  }

  async getSubchannels(cid) {
    let data = null
    try {
      data = await this.ts.channelList({ pid: cid })
    } catch (error) {
      throw new Error(error)
    }
    return data
  }

  async createChannel(name, properties) {
    let data = null
    try {
      data = await this.ts.channelCreate(name, properties)
    } catch (error) {
      throw new Error(error)
    }
    return data
  }

  async deleteChannel(cid, force) {
    let data = null
    try {
      data = await this.ts.channelDelete(cid, force)
    } catch (error) {
      throw new Error(error)
    }
    return data
  }
}

module.exports = TeamSpeakServer
