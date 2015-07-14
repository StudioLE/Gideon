// App modules
var menu = require('./menu')

// Begin module
module.exports = function() {   
  menu([
    'Restore functionality is not yet implemented',
    'To restore manually copy the archive from the destination and extract'
  ])

  // Close the input stream
  process.stdin.end()
}
