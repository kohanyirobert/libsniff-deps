var download = require('libsniff-download')
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
  download(_.defaults(opts, {
    archive: true,
    getUrl: getUrl,
    getDestName: getDestName
  }), cb)
}
