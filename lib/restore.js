// App modules
var terminal = require('./terminal')

// Begin module
module.exports = function() {   
  terminal([
    'Restore functionality is not yet implemented',
    'To restore manually copy the archive from the destination and extract'
  ])

  // Close the input stream
  process.stdin.end()
}
