var Promise = require('bluebird');
var cloudinary = require('cloudinary');
var util = require('util');

var baseStore = require('ghost-storage-base');

// TODO: Add support for private_cdn
// TODO: Add support for secure_distribution
// TODO: Add support for cname
// TODO: Add support for cdn_subdomain
// http://cloudinary.com/documentation/node_additional_topics#configuration_options

function CloudinaryStore(config) {
    baseStore.call(this);
    this.config = config || {};
    cloudinary.config(config);
}

util.inherits(CloudinaryStore, baseStore);

CloudinaryStore.prototype.save = function(image) {
  var secure = this.config.secure || false;

  return new Promise(function(resolve) {
    cloudinary.uploader.upload(image.path, function(result) {
      resolve(secure ? result.secure_url : result.url);
    });
  });
};

CloudinaryStore.prototype.delete = function(image) {

  return new Promise(function(resolve) {
    cloudinary.uploader.destroy('zombie', function(result) {
      resolve(result)
    });
  });
};

CloudinaryStore.prototype.exists = function(filename) {
  return new Promise(function(resolve) {
    if (cloudinary.image(filename, { })) {
        resolve(true);
    } else {
        resolve(false);
    }
  });

}

CloudinaryStore.prototype.serve = function() {
  return function (req, res, next) {
    next();
  };
};

module.exports = CloudinaryStore;
