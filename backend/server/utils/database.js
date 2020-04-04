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
    data.id = shortid.generate()
    return this.db.get('channelSync').push(data).write()
  }

  readAllChannelSync() {
    const data = this.db.get('channelSync').value()
    return data
  }

  readSingleChannelSync(id) {
    const data = this.db.get('channelSync').find({ id }).value()
    return data
  }

  readSingleChannelSyncByParent(parent) {
    const data = this.db.get('channelSync').find({ parent }).value()
    return data
  }

  updateChannelSync(data) {
    return this.db.get('channelSync').find({ id: data.id }).assign(data).write()
  }

  deleteChannelSync(id) {
    return this.db.get('channelSync').remove({ id }).write()
  }
}

module.exports = Database
