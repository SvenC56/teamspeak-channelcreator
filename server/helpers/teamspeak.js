const { TeamSpeak, QueryProtocol } = require('ts3-nodejs-library')

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
        .then(async (teamspeak) => {
          await Promise.all([
            teamspeak.registerEvent('server'),
            teamspeak.registerEvent('channel', 0),
            teamspeak.registerEvent('textserver'),
            teamspeak.registerEvent('textchannel'),
            teamspeak.registerEvent('textprivate')
          ])
          teamspeak.on('close', async () => {
            await teamspeak.reconnect(-1, 1000)
          })
          teamspeak.on('clientmoved', (ev) => {
            console.log(ev)
          })
          teamspeak.on('clientdisconnect', (ev) => {
            console.log(ev)
          })
        })
        .catch((e) => {
          throw e
        })
    } catch (e) {
      // error handling logic
    }
  }
}
module.exports = TeamSpeakServer
