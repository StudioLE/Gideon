// Node modules
var _ = require('lodash')
var t_menu = require('terminal-menu')
var chalk = require('chalk')

// App modules
var util = require('./util')

// Globals
var terminal

// Begin module
module.exports = {

  /**
   * Capture user input
   */
  init: function() {
    // Without this, we would only get streams once enter is pressed
    process.stdin.setRawMode(true)
    // Resume stdin in the parent process (node app won't quit all by itself
    // unless an error or process.exit() happens)
    process.stdin.resume()
  },

  /**
   * Write a menu to the terminal
   *
   * @param {String|Array} Message or messages
   * @param {Array} Selectable menu options
   * @param {Function} Callback
   * @return {Object} Terminal object
   * 
   */
  write: function(message, options, callback) {
    // If no callback given create one
    if( ! callback) callback = function() {}
    
    // If a previous terminal has been opened then close it
    if(terminal) terminal.close()

    terminal = t_menu({ width: 70 })
    
    // Reset the terminal, clearing all contents 
    terminal.reset()

    terminal.write(util.title())

    // Write message or messages to the console
    if(_.isString(message)) message = [message]
    _.each(message, function(message) {
      terminal.write(chalk.bold(message + '\n'))
    })

    terminal.write('\n')

    // If options were given write them to the console
    if(options) {
      _.each(options, function(option) {
        terminal.add(option)
      })
    
      terminal.write('\n')
      terminal.add('Cancel')
    }

    // Pipe the terminal menu to the console
    process.stdin.pipe(terminal.createStream()).pipe(process.stdout)
   
    // Run callback when a terminal item is selected
    terminal.on('select', function(item, index) {
      if(item == 'Cancel') return callback(Error('Cancelled by user'))
      callback(null, item, index)
    })

    return terminal
  },

  /**
   * Close terminal and exit process
   */
  end: function() {
    // Close the terminal
    terminal.close()

    // process.stdin.resume() prevents node from exiting. 
    // process.exit() overrides in more cases than stdin.pause() or stdin.end()
    // it also means we don't need to call process.stdin.setRawMode(false)
    process.exit()
  }
}
