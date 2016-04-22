var download = require('libsniff-download').download
var urldl = require('libsniff-download').urldl
var _ = require('lodash')

var pkg = require('libsniff-ffmpeg-binaries/package.json')

var getUrl = function(target) {
  var url = 'https://github.com/kohanyirobert/'
  url += pkg.name
  url += '/releases/download/v'
  url += pkg.version
  url += '/'
  return url + getDestName(target)
}

var getDestName = function(target) {
  return target + '.zip'
}

module.exports = function(opts, cb) {
  var downloader = download(urldl)
  downloader(_.defaults(opts, {
    targetDir: false,
    archive: true,
    getUrl: getUrl,
    getDestName: getDestName
  }), cb)
}
