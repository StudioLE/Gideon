// Node modules
var _ = require('lodash')

// Begin module
module.exports = {

  machine_date: function() {
    var d = new Date()
    return _.map([
      d.getFullYear(),
      d.getMonth()+1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    ], function(num) {
      num = num + ''
      if(num.length < 2) return '0' + num
      return num
    }).join('-')
  },

  start_time: false,

  timer: function(init) {
    if(init) return this.start_time = process.hrtime()
    var t = process.hrtime(this.start_time)
    // Seconds + nano converted to seconds
    return (t[0] + t[1] / 1000000000).toFixed(2) + ' seconds'
  },

  uppercase_first: function(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

}
