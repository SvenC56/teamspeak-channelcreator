const { TeamSpeak } = require('ts3-nodejs-library')

class TeamSpeakServer {
  constructor(config) {
    this.ts = TeamSpeak
    this.config = config
    this.whoami = null
    this.teamspeakReady = false
    this.init()
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
      await this.ts.reconnect(-1, 1000)
      this.teamspeakReady = true
    })
    this.ts.on('clientmoved', (event) => {})
    this.ts.on('clientdisconnect', (event) => {})
  }

  async getChannels() {
    const data = await this.ts.channelList()
    return data
  }

  async createChannel() {
    const data = await this.ts.channelCreate()
    return data
  }
}
module.exports = TeamSpeakServer
