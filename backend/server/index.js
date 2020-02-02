const path = require('path')
const history = require('connect-history-api-fallback')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./utils/winston')
const api = require('./routes/api')
const app = express()

const { PORT = 8080 } = process.env

app.use(express.json())
// API Routes
app.use('/api', api)
app.use(express.static(path.join(__dirname, '../../frontend/dist/')))
app.use(helmet())
app.use(cors())
app.use('/', history())

app.get('/*', (req, res) => {
  // path must be absolute or specify root to res.sendFile
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
})

const server = app.listen(PORT, () => {
  logger.log({
    level: 'info',
    message: `Server is running on port ${PORT}.`
  })
})

exports.module = server
