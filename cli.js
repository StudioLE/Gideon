// App modules
var backup = require('./lib/backup')
var restore = require('./lib/restore')
var terminal = require('./lib/terminal')

// Get command line args
var arg = process.argv.slice(2)

// Capture user input
terminal.init()

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
  terminal.write('Choose an operation', ['Backup', 'Restore'], function(error, selection, index) {
    if(selection == 'Backup') {
      backup()
    }
    else if(selection == 'Restore') {
      restore()
    }
    else {
      terminal.end()
    }
  })
}
