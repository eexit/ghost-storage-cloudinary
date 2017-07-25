'use strict';

var Promise = require('bluebird');
var cloudinary = require('cloudinary');
var util = require('util');
var BaseAdapter = require('ghost-storage-base');

class CloudinaryAdapter extends BaseAdapter{
  constructor(options) {
    super(options);
    this.config = options || {};
    cloudinary.config(options);
  }

  exists(filename) {
    return new Promise(function(resolve) {
      if (cloudinary.image(filename, { })) {
          resolve(true);
      } else {
          resolve(false);
      }
    });
  }

  save(image, targetDir) {
    var secure = this.config.secure || false;

    return new Promise(function(resolve) {
      cloudinary.uploader.upload(image.path, function(result) {
        resolve(secure ? result.secure_url : result.url);
      });
    });
  }

  serve() {
    return function customServe(req, res, next) {
      next();
    }
  }

  delete(image) {
    return new Promise(function(resolve) {
      cloudinary.uploader.destroy('zombie', function(result) {
        resolve(result)
      });
    });
  }

  read() {
    //Not used. The image is uploaded with the direct URL to the Cloudinary Service. No Need to pass through this plugin
  }
}

module.exports = CloudinaryAdapter;
