'use strict';

var StorageBase = require('ghost-storage-base'),
    Promise = require('bluebird'),
    cloudinary = require('cloudinary').v2,
    path = require('path'),
    request = require('request').defaults({ encoding: null });

class CloudinaryAdapter extends StorageBase {

    constructor(options) {
        super(options);

        var config = options || {};
        var auth = config.auth || config;

        // Kept to avoid a BCB with 2.x versions
        var legacy = config.configuration || {};

        this.uploadOptions = config.upload || legacy.file || {};
        this.displayOptions = config.display || legacy.image || {};

        cloudinary.config(auth);
    }

    exists(filename) {
        var pubId = this.toCloudinaryId(filename);

        return new Promise(function(resolve, reject) {
            cloudinary.uploader.explicit(pubId, {type: 'upload'}, function(err, res) {
                if (err) {
                    return resolve(false);
                }
                resolve(true);
            });
        });
    }

    save(image) {
        var displayOptions = this.displayOptions;
        var uploadOptions = Object.assign(
            this.uploadOptions,
            { public_id: path.parse(this.getSanitizedFileName(image.name)).name }
        );

        return new Promise(function(resolve, reject) {
            cloudinary.uploader.upload(image.path, uploadOptions, function(err, res) {
                if (err) {
                    return reject(new Error('Could not upload image ' + image.path));
                }
                resolve(cloudinary.url(res.public_id.concat('.', res.format), displayOptions));
            });
        });
    }

    serve() {
        return function (req, res, next) {
            next();
        };
    }

    delete(filename) {
        var pubId = this.toCloudinaryId(filename);

        return new Promise(function(resolve, reject) {
            cloudinary.uploader.destroy(pubId, function(err, res) {
                if (err) {
                    return reject(new Error('Could not delete image ' + filename));
                }
                resolve(res);
            });
        });
    }

    read(options) {
        options = options || {};
        return new Promise(function (resolve, reject) {
            request.get(options.path, function (err, res) {
                if (err) {
                    return reject(new Error('Could not read image ' + options.path));
                }
                resolve(res.body);
            });
        });
    }

    /**
     *  Extracts the a Cloudinary-ready file name for API usage.
     *  If a "folder" upload option is set, it will prepend its
     *  value.
     */
    toCloudinaryFile(filename) {
        var file = path.parse(filename).base;
        if (this.uploadOptions.folder !== undefined) {
            return path.join(this.uploadOptions.folder, file);
        }
        return file;
    }

    /**
     * Returns the Cloudinary public ID off a given filename
     */
    toCloudinaryId(filename) {
        var parsed = path.parse(this.toCloudinaryFile(filename));
        return path.join(parsed.dir, parsed.name);
    }
}

module.exports = CloudinaryAdapter;
