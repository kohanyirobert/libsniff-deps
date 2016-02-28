var Decompress = require('decompress')
var mkdirp = require('mkdirp')
var path = require('path')
var vargs = require('vargs-callback')
var rimraf = require('rimraf')
var request = require('request')
var fs = require('fs')
var package = require('libsniff-ffmpeg-binaries/package.json')

var baseUrl = 'https://github.com/kohanyirobert/'
baseUrl += package.name
baseUrl += '/releases/download/v'
baseUrl += package.version
baseUrl += '/'

var getUrl = function(target) {
  return baseUrl + getZip(target)
}

var getPath = function(opts, target) {
  return path.join(opts.dir, getZip(target))
}

var getZip = function(target) {
  return target + '.zip'
}

var doDecompress = function(opts, target, cb) {
  new Decompress()
    .src(getPath(opts, target))
    .dest(opts.dir)
    .use(Decompress.zip())
    .run(function(err, files) {
      if (err) {
        throw new Error(err)
      }
      fs.unlink(getPath(opts, target))
      cb(files)
    })
}

var doCollect = function(opts, target, downloads, files, cb) {
  downloads.push({
    target: target,
    files: files.map(function(file) {
      return file.path
    })
  })
  if (downloads.length === opts.targets.length) {
    cb(downloads)
  }
}

var doTargets = function(opts, cb) {
  var downloads = []
  opts.targets.forEach(function(target) {
    var out = fs.createWriteStream(getPath(opts, target))
    out.on('finish', function() {
      doDecompress(opts, target, function(files) {
        doCollect(opts, target, downloads, files, cb)
      })
    })
    request(getUrl(target)).pipe(out)
  })
}

var doCreate = function(opts, cb) {
  mkdirp(opts.dir, function() {
    doTargets(opts, cb)
  })
}

var doCleanup = function(opts, cb) {
  rimraf(opts.dir, function() {
    doCreate(opts, cb)
  })
}

var doDownload = function(opts, cb) {
  opts = opts || {}
  opts.dir = opts.dir || 'ffmpeg'
  opts.targets = opts.targets || [
    'linux-ia32',
    'linux-x64',
    'win32-ia32',
    'win32-x64',
    'darwin-x64'
  ]
  cb = cb || function() {}
  doCleanup(opts, cb)
}

module.exports = vargs.strict(doDownload)
