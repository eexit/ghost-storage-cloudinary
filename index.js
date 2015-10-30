var Promise = require('bluebird');
var cloudinary = require('cloudinary');

// TODO: Add support for private_cdn
// TODO: Add support for secure_distribution
// TODO: Add support for cname
// TODO: Add support for cdn_subdomain
// http://cloudinary.com/documentation/node_additional_topics#configuration_options

function store(config) {
  this.config = config || {};
  cloudinary.config(config);
}

store.prototype.save = function(image) {
  var secure = this.config.secure || false;

  return new Promise(function(resolve) {
    cloudinary.uploader.upload(image.path, function(result) {
      resolve(secure ? result.secure_url : result.url);
    });
  });
};

store.prototype.serve = function() {
  return function (req, res, next) {
    next();
  };
};

module.exports = store;
