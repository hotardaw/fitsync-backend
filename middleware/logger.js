const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, '/..', '/logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '/..', '/logs'))
    }
    await fsPromises.appendFile(
      path.join(__dirname, '/..', '/logs', logFileName),
      logItem
    )
  } catch (err) {
    console.log(err)
  }
}

const logger = (req, res, next) => {
  // log everything that comes in. add conditionals later for where the request originates:
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  // log in dev console during development:
  console.log(`${req.method} ${req.path}`)
  // move on to the next piece of middleware - this logger comes first
  next()
}

module.exports = { logEvents, logger }
