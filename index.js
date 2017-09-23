var BlueBird = require('bluebird');
var cloudinary = require('cloudinary');
var util = require('util');
var BaseAdapter = require('ghost-storage-base');
var path = require('path');

class CloudinaryAdapter extends BaseAdapter{
  constructor(options) {
    super(options);
    this.config = options || {};
    cloudinary.config(options);
  }

  exists(filename) {
    return new BlueBird(function(resolve) {
      cloudinary.v2.api.resource(path.parse(filename).name, {type: 'upload'}, function(error, result) {
        if (result) {
          resolve(result);
        } else {
          resolve(false);
        }
      });
    });
  }

  save(image, targetDir) {
    var cloudinaryImageSettings = this.config.configuration.image;
    var cloudinaryFileSettings = this.config.configuration.file || {};
    //Using the real image name sanitizing it for the web
    cloudinaryFileSettings.public_id = path.parse(this.getSanitizedFileName(image.name)).name;

    return new BlueBird(function(resolve) {
      cloudinary.uploader.upload(image.path, function(result) {
        if (result.error) {
          return reject(new errors.GhostError({
              err: result.error,
              message: 'Could not upload the image: ' + image.path
          }));
        } else {
          resolve(cloudinary.url(result.public_id.concat(".", result.format), cloudinaryImageSettings));
        }
      }, cloudinaryFileSettings);
    });
  }

  serve() {
    return function customServe(req, res, next) {
      next();
    };
  }

  delete(filename) {
    return new BlueBird(function(resolve) {
      cloudinary.uploader.destroy(path.parse(filename).name, function(result) {
        resolve(result);
      });
    });
  }

  read(options) {
    options = options || {};
    return new BlueBird(function (resolve, reject) {
      var request = require('request').defaults({ encoding: null });
      request.get(options.path, function (err, res) {
        if (err) {
          reject(new Error("Cannot download image"));
        } else {
          resolve(res.body);
        }
      });
    });
  }
}

module.exports = CloudinaryAdapter;
