const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const appRoot = require('app-root-path')
const shortid = require('shortid')

const adapter = new FileSync(`${appRoot}/db/db.json`)
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ channelSync: [] }).write()

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

exports.createChannelSync = (data) => {
  // eslint-disable-next-line prefer-const
  let dataset = sanitizeData(data)
  dataset.id = shortid.generate()
  return db
    .get('channelSync')
    .push(dataset)
    .write()
}

exports.readAllChannelSync = () => {
  const data = db.get('channelSync')
  return data
}

exports.readSingleChannelSync = (id) => {
  const data = db
    .get('channelSync')
    .find({ id })
    .value()
  return data
}

exports.readSingleChannelSyncByParent = (parent) => {
  const data = db
    .get('channelSync')
    .find({ parent })
    .value()
  return data
}

exports.updateChannelSync = (data) => {
  const dataset = sanitizeData(data)
  return db
    .get('channelSync')
    .find({ id: dataset.id })
    .assign(dataset)
    .write()
}

exports.deleteChannelSync = (id) => {
  return db
    .get('channelSync')
    .remove({ id })
    .write()
}
