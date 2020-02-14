import path from 'path'
import history from 'connect-history-api-fallback'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import {} from 'dotenv/config'
import errorHandler from './utils/errorHandler'
import logger from './utils/winston'
import config from './utils/config'
import api from './routes/api'

const app = express()
const port = config.get('port')

app.use(express.json())

// API Routes
app.use('/api', api)
app.use(express.static(path.join(__dirname, '../../frontend/dist/')))

// Error Middleware
errorHandler(app)

if (config.get('env') === 'production') {
  app.use(helmet())
  app.use(cors())
  app.use('/', history())
}

app.get('/*', (req, res) => {
  // path must be absolute or specify root to res.sendFile
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
})

const server = app.listen(port, () => {
  logger.log({
    level: 'info',
    message: `Server is running on port ${port}.`
  })
})

exports.module = server
