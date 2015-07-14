// App modules
var terminal = require('./terminal')

// Begin module
module.exports = function() {
  terminal.write([
    'Restore functionality is not yet implemented',
    'To restore manually copy the archive from the destination and extract'
  ])

  // Close the input stream
  terminal.end()
}
