const { QueryProtocol } = require('ts3-nodejs-library')
require('dotenv').config()

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

module.exports = teamspeakConfig
