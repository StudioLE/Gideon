# Gideon

A command line utility to archive a directory and upload it to S3.

Gideon has a number of key features making it the perfect utility for backing up web directories:

- Straight to S3 - The backup is copied straight to S3 through an upload steam
- Filtering - By default `bower_components`, `node_modules` & `.git` are automatically ignored
- MySQL Backup - Include a fresh mysql_dump with the backup
- .env support - Database details are automatically loaded from .env files in common locations
- Stunning terminal interface - Gideon uses [Sqwk](https://github.com/StudioLE/sqwk) to provide an intuitive interface

## Installation

The application requires Node.js and npm to be installed, instructions can be found at [nodejs.org](http://nodejs.org/).

With node installed run the following to install Gideon globally.

```
npm install -g gideon
```

Or for the latest development release

```
npm install -g https://github.com/StudioLE/Gideon/archive/master.tar.gz
```

## Configuration

Gideon uses [node-config](https://github.com/lorenwest/node-config) so it's highly configurable. I recommend copying the `config/default.json` file to `config/local.json` and editing that so that your changes are not overwritten by future updates.

```
cd /usr/lib/node_modules/gideon
cp config/default.json config/local.json
nano config/local.json
```

## Usage

Wizard selection
```
gideon
```

Run the backup wizard
```
gideon backup
```

Run a named backup
```
gideon backup $DIRECTORY_NAME [$INCLUDE_DB y/n]
```

Run the restore wizard
```
gideon restore
```

Config parameters can be defined on the command line as follows
```
gideon backup --NODE_CONFIG='{"target":"s3"}'
```

## Roadmap / Todo

The following items will be completed before the 1.0.0 release

- [ ] Write tests
- [ ] Restore from local
- [ ] Restore from S3
- [x] Run specific backup directly

## Contributing

I'm always on the look out for collaborators so feel free to suggest new features, log an issue or just fork at will.
