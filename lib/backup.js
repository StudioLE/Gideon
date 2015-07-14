// Node modules
var fs = require('fs')
var config = require('config')
var p = require('path')
var _ = require('lodash')
var async = require('async')
var chalk = require('chalk')
var humanize = require('humanize')
var archiver = require('archiver')

// App modules
var menu = require('./menu')
var util = require('./util')

// Begin module
module.exports = function() {

  // Globals
  var subject, archive

  if(config.format == 'zip') {
    archive = archiver.create('zip', {})
  }
  else if(config.format == 'tar.gz') {
    archive = archiver('tar', {
      gzip: true,
      gzipOptions: config.gzip_options
    })
  }
  else if(config.format == 'tar') {
    archive = archiver('tar', {})
  }
  else {
    throw Error('Invalid archive format in config')
  }

  // Begin async
  async.waterfall([
    function(callback) { // Read source parent directory

      fs.readdir(config.source.parent_directory, callback)

    },
    function(files, callback) { // INPUT: Select source directory

      menu('Select a directory to backup', files, callback)

    },

    function(dir_name, index, callback) { // Load .env

      source = {
        name: dir_name,
        directory: p.join(config.source.parent_directory, dir_name)
      }

      var env_path = function(dir) {
        return p.join(source.directory, dir, '.env')
      }

      // Check whether a .env file exists
      // @todo fs.exists will be deprecated so we may need to change this eventually
      async.detect(_.map(['', 'october', 'laravel'], env_path), fs.exists, function(env_path) {

        // console.log('.env exists at %s', env_path)

        // If there are .env vars load them
        if(env_path) {
          // Load .env variables
          require('dotenv').config({ path: env_path })
          // _.each(['DB_DATABASE', 'DB_HOST', 'DB_USERNAME', 'DB_PASSWORD'], function(key) {
          //   console.log(key + ' = ', process.env[key])
          // })
        }

        // If there is a database callback true else callback false
        env = process.env
        if(env_path && env.DB_DATABASE && env.DB_USERNAME && env.DB_PASSWORD) {
          callback(null, true)
        }
        else {
          callback(null, false)
        }
      })

    },
    function(db_found, callback) { // INPUT: Backup MySQL?
      
      if(db_found) {
        menu('A database was found. Would you like to include it in the backup?', ['Yes', 'No'], callback)
      }
      else {
        callback(null, 'No', 1)
      }

    },
    function(backup_database, index, callback) { // Backup MySQL
      
      if(backup_database == 'Yes') {
        // @todo Backup MySQL goes here...
        callback(null, true)
      }
      else {
        callback(null, false)
      }
    },
    function(backup_database, callback) { // Backup directory

      // @todo Archive & stream to S3 operation goes here...
      archive.directory(source.directory, source.name)

      if(backup_database) {
        // @todo If database include it in backup
        // archive.append()
      }

      var output_file = p.join(config.destination.local.directory, source.name + '-' + util.machine_date() + '.' + config.format)

      menu(['Running backup', chalk.dim(output_file)])

      var output = fs.createWriteStream(output_file)

      output.on('close', function() {
        callback(null, output_file, humanize.filesize(archive.pointer()))
      })

      archive.on('error', function(err) {
        throw err
      })

      archive.pipe(output)

      archive.finalize()

    }
  ], function(err, output_file, size) {

    if(err){
      if(err.message !== 'Cancelled by user') {
        throw err
      }
      process.stdin.end()
    }
    else {

      menu(['Backup complete', chalk.dim(output_file), chalk.dim(size)])

      // Close the input stream
      process.stdin.end()
    }

  })
}
