var Promise = require('bluebird');
var cloudinary = require('cloudinary');
var util = require('util');

baseStore = require('../../../core/server/storage/base');

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

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}


util.inherits(CloudinaryStore, baseStore);

CloudinaryStore.prototype.save = function(image) {
  var cloudinaryImageSetting = this.config.configuration;

  return new Promise(function(resolve) {
    cloudinary.uploader.upload(image.path, function(result) {
        resolve(cloudinary.url(result.public_id.concat(".", result.format), cloudinaryImageSetting ));
    });
});
};

CloudinaryStore.prototype.delete = function(image) {
  return new Promise(function(resolve) {
    cloudinary.uploader.destroy(image.path, function(result) {
      resolve(result)
  });
});
};

CloudinaryStore.prototype.exists = function(filename) {
  return new Promise(function(resolve) {
    if (cloudinary.image(filename, { quality: 50 })) {
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