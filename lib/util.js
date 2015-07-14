// Node modules
var chalk = require('chalk')

// Begin module
module.exports = {
  name: 'Gideon Backup',
  version: '1.0.0-alpha',
  title: function() {
    return chalk.bold(this.name) + ' ' + this.version + '\n\n'
  }

}
