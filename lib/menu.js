// Node modules
var _ = require('lodash')
var Menu = require('terminal-menu')
var chalk = require('chalk')

// App modules
var util = require('./util')

// Begin module
module.exports = function(message, options, callback) {

  if( ! message) return menu.close()

  menu = Menu()
  menu.reset()
  menu.write(util.title())
  menu.write(chalk.bold(message + ' \n\n'))

  _.each(options, function(option) {
    menu.add(option)
  })
  
  if(options.length) {
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
