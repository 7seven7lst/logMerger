'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
const moment = require('moment')
// 3rd party library priority queue seems slower than lodash's sortBy
//const PriorityQueue = require('js-priority-queue')

module.exports = (logSources, printer) => {
  let promiseLogArray = _.reduce(logSources, (promiseArray, logSource) => {
    promiseArray.push(loopLogsAsync(logSource, []))
    return promiseArray
  }, [])

  return Promise.all(promiseLogArray)
  .then(logsArr => {
    let logQueue = [];

    _.forEach(logsArr, logs => {
      _.forEach(logs, log => {
        logQueue.push(log)
      })
    })

    logQueue = _.sortBy(logQueue, log => {
      return moment(log.date)
    })
    _.forEach(logQueue, log => {
      printer.print(log)
    })
    
    printer.done()
  })
}

const loopLogsAsync = (logSource, logArray) => {
  return logSource.popAsync()
  .then(log => {
    if (!log) {
      return logArray
    } else {
      logArray.push(log)
      return loopLogsAsync(logSource, logArray)
    }
  })
}
