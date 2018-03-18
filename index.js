'use strict';

require('bluebird');

const StorageBase = require('ghost-storage-base'),
    cloudinary = require('cloudinary').v2,
    path = require('path'),
    request = require('request').defaults({encoding: null});

class CloudinaryAdapter extends StorageBase {

    /**
     *  @override
     */
    constructor(options) {
        super(options);

        const config = options || {},
            auth = config.auth || config,
            // Kept to avoid a BCB with 2.x versions
            legacy = config.configuration || {};

        this.uploadOptions = config.upload || legacy.file || {};
        this.fetchOptions = config.fetch || legacy.image || {};

        cloudinary.config(auth);
    }

    /**
     *  @override
     */
    exists(filename) {
        const pubId = this.toCloudinaryId(filename);

        return new Promise((resolve) => {
            cloudinary.uploader.explicit(pubId, {type: 'upload'}, (err) => {
                if (err) {
                    return resolve(false);
                }
                return resolve(true);
            });
        });
    }

    /**
     *  @override
     */
    save(image) {
        const {fetchOptions} = this.fetchOptions,
            uploadOptions = Object.assign(
                this.uploadOptions,
                {public_id: path.parse(this.getSanitizedFileName(image.name)).name}
            );

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(image.path, uploadOptions, (err, res) => {
                if (err) {
                    return reject(new Error(`Could not upload image ${image.path}`));
                }
                return resolve(cloudinary.url(res.public_id.concat('.', res.format), fetchOptions));
            });
        });
    }

    /**
     *  @override
     */
    serve() {
        return (req, res, next) => {
            next();
        };
    }

    /**
     *  @override
     */
    delete(filename) {
        const pubId = this.toCloudinaryId(filename);

        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(pubId, (err, res) => {
                if (err) {
                    return reject(new Error(`Could not delete image ${filename}`));
                }
                return resolve(res);
            });
        });
    }

    /**
     *  @override
     */
    read(options) {
        const opts = options || {};
        return new Promise((resolve, reject) => {
            request.get(opts.path, (err, res) => {
                if (err) {
                    return reject(new Error(`Could not read image ${opts.path}`));
                }
                return resolve(res.body);
            });
        });
    }

    /**
     *  Extracts the a Cloudinary-ready file name for API usage.
     *  If a "folder" upload option is set, it will prepend its
     *  value.
     *  @param {string} filename The wanted image filename
     *  @return {string} Cloudinary-ready image name
     */
    toCloudinaryFile(filename) {
        const file = path.parse(filename).base;
        if (typeof this.uploadOptions.folder !== 'undefined') {
            return path.join(this.uploadOptions.folder, file);
        }
        return file;
    }

    /**
     *  Returns the Cloudinary public ID off a given filename
     *  @param {string} filename The wanted image filename
     *  @return {string} Cloudinary-ready ID for given image
     */
    toCloudinaryId(filename) {
        const parsed = path.parse(this.toCloudinaryFile(filename));
        return path.join(parsed.dir, parsed.name);
    }
}

module.exports = CloudinaryAdapter;
