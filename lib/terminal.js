// Node modules
var _ = require('lodash')
var Menu = require('terminal-menu')
var chalk = require('chalk')

// App modules
var util = require('./util')

// Begin module
module.exports = function(message, options, callback) {

  if( ! callback) callback = function() {}

  menu = Menu({ width: 70 })
  menu.reset()
  menu.write(util.title())

  if(_.isString(message)) message = [message]
  _.each(message, function(message) {
    menu.write(chalk.bold(message + '\n'))
  })

  menu.write('\n')

  if(options) {
    _.each(options, function(option) {
      menu.add(option)
    })
  
    menu.write('\n')
    menu.add('Cancel')
  }

  process.stdin.pipe(menu.createStream()).pipe(process.stdout)
 
  menu.on('select', function(item, index) {
    if(item == 'Cancel') return callback(Error('Cancelled by user'))
    menu.close()
    callback(null, item, index)
  })

  menu.on('close', function() {
    // process.stdin.setRawMode(false)
    // process.stdin.end()
  })

  // return menu
}
