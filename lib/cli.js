// Node modules
var sqwk = require('sqwk')

// App modules
var backup = require('./backup')
var restore = require('./restore')
var util = require('./util')

// Get command line args
var arg = process.argv.slice(2)

// Capture user input
sqwk.init({
  title: 'Gideon Backup'
})

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
  sqwk.write('Choose an operation', ['Backup', 'Restore'], function(error, selection, index) {
    if(selection == 'Backup') {
      backup()
    }
    else if(selection == 'Restore') {
      restore()
    }
    else {
      sqwk.end()
    }
  })
}
