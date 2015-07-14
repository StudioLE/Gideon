// App modules
var backup = require('./lib/backup')
var restore = require('./lib/restore')
var menu = require('./lib/menu')

// Get command line args
var arg = process.argv.slice(2)

// Without this, we would only get streams once enter is pressed
process.stdin.setRawMode(true)
// Resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
process.stdin.resume()

// Backup
if(arg[0] == 'backup') {
  backup()
}
// Restore
else if(arg[0] == 'restore') {
  restore()
}
// Invalid
else {
  menu('Choose an operation', ['Backup', 'Restore'], function(error, selection, index) {
    if(selection == 'Backup') {
      backup()
    }
    else if(selection == 'Restore') {
      restore()
    }
    else {
      process.stdin.end()
    }
  })
}
