import convict from 'convict'
import logger from './winston'

// Define a schema
var config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  baseUrl: {
    doc: 'The base url the app is running on.',
    format: '*',
    default: 'http://localhost:8080',
    env: 'BASE_URL',
  },
  port: {
    doc: 'The port the app is listening to.',
    format: '*',
    default: '8080',
    env: 'PORT',
  },
  teamspeak: {
    host: {
      doc: 'The TeamSpeak server host address.',
      format: '*',
      default: 'localhost',
      env: 'TEAMSPEAK_HOST',
    },
    serverPort: {
      doc: 'The TeamSpeak server port.',
      format: 'port',
      default: 9987,
      env: 'TEAMSPEAK_SERVER_PORT',
    },
    queryPort: {
      doc: 'The TeamSpeak query port.',
      format: 'port',
      default: 10011,
      env: 'TEAMSPEAK_QUERY_PORT',
    },
    botName: {
      doc: 'The Bot name.',
      format: '*',
      default: 'Bot',
      env: 'TEAMSPEAK_BOT_NAME',
    },
    protocol: {
      doc: 'The TeamSpeak query protocol (ssh or raw).',
      format: ['ssh', 'raw'],
      default: 'raw',
      env: 'TEAMSPEAK_PROTOCOL',
    },
    username: {
      doc: 'The TeamSpeak query username.',
      format: '*',
      default: 'serveradmin',
      env: 'TEAMSPEAK_USERNAME',
    },
    password: {
      doc: 'The TeamSpeak query password.',
      format: '*',
      default: '',
      env: 'TEAMSPEAK_PASSWORD',
    },
  },
})

// Perform validation
try {
  config.validate({ allowed: 'strict' })
} catch (e) {
  logger.log({
    level: 'error',
    message: e.message,
  })
}

module.exports = config
