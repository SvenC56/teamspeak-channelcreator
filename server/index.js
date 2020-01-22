const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const helmet = require('helmet')
const { QueryProtocol } = require('ts3-nodejs-library')
const config = require('../nuxt.config.js')
const api = require('./routes/api')
const TeamSpeakServer = require('./helpers/teamspeak')
const app = express()

// Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production'

app.use(express.json())

// API Routes
app.use('/api', api)

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Cors, Helmet & Rate Limiter
  app.use(helmet())

  // Listen the server
  app.listen(port, host)

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

  // eslint-disable-next-line no-unused-vars
  const teamspeakServer = new TeamSpeakServer(teamspeakConfig)
}
start()
