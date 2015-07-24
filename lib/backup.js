// Node modules
var fs = require('fs')
var config = require('config')
var p = require('path')
var _ = require('lodash')
var async = require('async')
var sqwk = require('sqwk')
var chalk = require('chalk')
var humanize = require('humanize')
var archiver = require('archiver')
var zlib = require('zlib')
var spawn    = require('child_process').spawn
var aws = require('aws-sdk')
aws.config.update(config.destination.s3)

// App modules
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

      sqwk.write('Select a directory for ' + config.target + ' backup', files, callback)

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
      async.detect(_.map([''].concat(config.dotenv_directories), env_path), fs.exists, function(env_path) {

        // If there are .env vars load them
        if(env_path) {
          // Load .env variables
          require('dotenv').config({ path: env_path })
        }

        // If there is a database callback true else callback false
        var env = process.env
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
        sqwk.write('A database was found. Would you like to include it in the backup?', ['Yes', 'No'], callback)
      }
      else {
        callback(null, 'No', 1)
      }

    },
    function(backup_database, index, callback) { // Backup directory & MySQL

      // Start timers
      util.timer(true)

      // Output file name
      var output = {
        name: p.join(source.name + '-' + util.machine_date() + '.' + config.format)
      }

      sqwk.write([
        'Running ' + config.target + ' backup',
        chalk.dim(output.name)
      ])

      // Add filters to source directory
      var src = [source.directory + '/**'].concat(_.map(config.exclude_directories, function(str) {
        return '!**/' + str + '/**'
      }))


      archive.bulk([{
        src: src
      }])

      archive.on('error', function(err) {
        callback(err)
      })

      // If database include it in backup
      if(backup_database == 'Yes') {
        // Run mysqldump
        var mysqldump = spawn('mysqldump', [
          '-u', process.env.DB_USERNAME,
          '-p' + process.env.DB_PASSWORD,
          // '-p', process.env.DB_PASSWORD,
          process.env.DB_DATABASE
        ])

        // @todo mysqldump error method

        // Stream mysqldump to a new .sql file
        archive.append(mysqldump.stdout, { 
          name: process.env.DB_DATABASE + '.sql'
        })
      }

      if(config.target == 'local') {

        output.path = p.join(config.destination.local.directory, output.name)
        output.stream = fs.createWriteStream(output.path)

        output.stream.on('close', function() {
          callback(null, output.name, humanize.filesize(archive.pointer()), util.timer())
        })

      }
      else if(config.target == 's3') {

        var upload_size

        output.stream = require('s3-upload-stream')(new aws.S3()).upload({
          "Bucket": config.destination.s3.bucket,
          "Key": output.name
        })

        /* Handle progress. Example details object:
           { ETag: '"f9ef956c83756a80ad62f54ae5e7d34b"',
             PartNumber: 5,
             receivedSize: 29671068,
             uploadedSize: 29671068 }
        */
        output.stream.on('part', function(details) {
          upload_size = humanize.filesize(details.uploadedSize) + ' uploaded'
          sqwk.write([
            'Running ' + config.target + ' backup',
            chalk.dim(output.name),
            chalk.dim(upload_size) + ' so far'
          ])
        })

        /* Handle upload completion. Example details object:
           { Location: 'https://bucketName.s3.amazonaws.com/filename.ext',
             Bucket: 'bucketName',
             Key: 'filename.ext',
             ETag: '"bf2acbedf84207d696c8da7dbb205b9f-5"' }
        */
        output.stream.on('uploaded', function(details) {
          callback(null, output.name, upload_size, util.timer())
        })

      }
      else {
        callback(Error('Invalid backup target in config'))
      }

      output.stream.on('error', function(err) {
        callback(err)
      })

      archive.pipe(output.stream)

      archive.finalize()

    }
  ], function(err, file, size, time) {

    if(err){
      if(err.message == 'Cancelled by user') {
        // Do nothing
      }
      else if(err.code == 'ENOENT') {
        sqwk.write(['Could not create archive', chalk.dim('Check directory exists')])
      }
      else if(_.isString(err) && err.substr(0, 41) === 'Failed to create a multipart upload on S3') {
        sqwk.write(['Error occured connecting to S3', chalk.dim('Check your AWS credentials')])
      }
      else {
        sqwk.end(err)
      }
    }
    else {
      sqwk.write([
        util.uppercase_first(config.target + ' backup complete'),
        chalk.dim(file),
        chalk.dim(size),
        chalk.dim(time)
      ])
    }

    sqwk.end()

  })
}
