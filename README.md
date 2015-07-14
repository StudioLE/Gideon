# Gideon

A command line utility to archive a directory and upload it to S3.

Gideon has a number of key features making it the perfect utility for backing up web directories:

- Straight to S3 - The backup is copied straight to S3 through an upload steam
- Filtering - By default `bower_components`, `node_modules` & `.git` are automatically ignored
- MySQL Backup - Include a fresh mysql_dump with the backup
- .env support - Database details are automatically loaded from .env files in common locations
- Stunning terminal interface

## Installation

The application requires Node.js and npm to be installed, instructions can be found at [nodejs.org](http://nodejs.org/).

With node installed just run the following to install Gideon globally.

```
npm install -g gideon
```
## Configuration

Configuration options are available in `config/default.json`.

## Usage

At present the following operations are only available from within the gideon directory.

Wizard selection
```
node cli
```

Run the backup wizard
```
node cli backup
```

Run the restore wizard
```
node cli restore
```

## Roadmap / Todo

- [x] Stunning terminal interface
- [x] Archive directory (zip, tar & gzip)
- [x] Exclude directories (bower_components, node_modules, .git)
- [x] Mysql Backup

## Contributing

I'm always on the look out for collaborators so feel free to suggest new features, get in touch or just fork at will.
