'use strict'

const _ = require('lodash')
const moment = require('moment')
// 3rd party library priority queue seems slower than lodash's sortBy
//const PriorityQueue = require('js-priority-queue')

module.exports = (logSources, printer) => {
  let logQueue = []
  _.forEach(logSources, logSource => {
    let log = logSource.pop()
    while (log) {
      logQueue.push(log);
      log = logSource.pop()
    }
  })
  
  logQueue = _.sortBy(logQueue, log => {
    return moment(log.date)
  })
  _.forEach(logQueue, log => {
    printer.print(log)
  })
  
  printer.done()
}
