import { ensureFileSync } from 'fs-extra'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import appRoot from 'app-root-path'
import shortid from 'shortid'

const dbDir = `${appRoot}\\db\\database.json`
ensureFileSync(dbDir)
const adapter = new FileSync(`${appRoot}/db/database.json`)

class Database {
  constructor() {
    if (Database.instance instanceof Database) {
      return Database.instance
    }

    this.db = low(adapter)
    this.init()

    Database.instance = this
  }

  init() {
    this.db.defaults({ channelSync: [] }).write()
  }

  createChannelSync(data) {
    // eslint-disable-next-line prefer-const
    let dataset = sanitizeData(data)
    dataset.id = shortid.generate()
    return this.db
      .get('channelSync')
      .push(dataset)
      .write()
  }

  readAllChannelSync() {
    const data = this.db.get('channelSync')
    return data
  }

  readSingleChannelSync(id) {
    const data = this.db
      .get('channelSync')
      .find({ id })
      .value()
    return data
  }

  readSingleChannelSyncByParent(parent) {
    const data = this.db
      .get('channelSync')
      .find({ parent })
      .value()
    return data
  }

  updateChannelSync(data) {
    const dataset = sanitizeData(data)
    return this.db
      .get('channelSync')
      .find({ id: dataset.id })
      .assign(dataset)
      .write()
  }

  deleteChannelSync(id) {
    return this.db
      .get('channelSync')
      .remove({ id })
      .write()
  }
}

module.exports = Database

function sanitizeData(data) {
  // eslint-disable-next-line prefer-const
  let sanitizedData = data
  sanitizedData.prefix = data.prefix.trim()
  sanitizedData.topic = data.topic.trim()
  sanitizedData.description = data.description.trim()
  sanitizedData.parent = parseInt(data.parent)
  sanitizedData.minChannel = parseInt(data.minChannel)
  sanitizedData.maxUsers = parseInt(data.maxUsers)
  sanitizedData.codec = parseInt(data.codec)
  sanitizedData.quality = parseInt(data.quality)
  sanitizedData.joinPower = parseInt(data.joinPower)
  return sanitizedData
}
