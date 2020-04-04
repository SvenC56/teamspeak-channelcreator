import config from './config'

const teamspeakConfig = {
  username: config.get('teamspeak.username'),
  password: config.get('teamspeak.password'),
  host: config.get('teamspeak.host'),
  serverport: config.get('teamspeak.serverPort'),
  queryport: config.get('teamspeak.queryPort'),
  protocol: config.get('teamspeak.protocol'),
  nickname: config.get('teamspeak.botName'),
  keepAlive: true,
}

module.exports = teamspeakConfig
