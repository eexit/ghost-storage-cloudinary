'use strict';

require('bluebird');

const StorageBase = require('ghost-storage-base'),
    cloudinary = require('cloudinary').v2,
    path = require('path'),
    request = require('request').defaults({encoding: null}),
    plugin = require(path.join(__dirname, '/plugins')),
    common = (() => {
        // Tries to include GhostError helper
        try {
            return require(path.join(__dirname, '../../../lib/common'));
        } catch (ex) {
            // Use local mock instead
            return require(path.join(__dirname, 'errors'));
        }
    })();

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

        this.useDatedFolder = config.useDatedFolder || false;
        this.uploadOptions = config.upload || legacy.file || {};
        this.fetchOptions = config.fetch || legacy.image || {};
        this.rjsOptions = config.rjs || null;

        cloudinary.config(auth);
    }

    /**
     *  @override
     */
    exists(filename) {
        const pubId = this.toCloudinaryId(filename);

        return new Promise((resolve) => cloudinary.uploader.explicit(pubId, {type: 'upload'}, (err) => {
            if (err) {
                return resolve(false);
            }
            return resolve(true);
        }));
    }

    /**
     *  @override
     */
    save(image) {
        const uploadOptions = Object.assign(
            {}, this.uploadOptions,
            {public_id: path.parse(this.getSanitizedFileName(image.name)).name}
        );

        // Appends the dated folder if enabled
        if (this.useDatedFolder) {
            uploadOptions.folder = this.getTargetDir(uploadOptions.folder);
        }

        // Retinizes images if there is any config provided
        if (this.rjsOptions) {
            const rjs = new plugin.RetinaJS(this.uploader, uploadOptions, this.rjsOptions);
            return rjs.retinize(image);
        }

        return this.uploader(image.path, uploadOptions, true);
    }

    /**
     *  Uploads an image with options to Cloudinary
     *  @param {string} imagePath The image path to upload (local or remote)
     *  @param {object} options Cloudinary upload options
     *  @param {boolean} url If true, will do an extra Cloudinary API call to fetch the uploaded image with fetch options
     *  @return {Promise} The uploader Promise
     */
    uploader(imagePath, options, url) {
        const fetchOptions = Object.assign({}, this.fetchOptions);

        return new Promise((resolve, reject) => cloudinary.uploader.upload(imagePath, options, (err, res) => {
            if (err) {
                return reject(new common.errors.GhostError({
                    err: err,
                    message: `Could not upload image ${imagePath}`
                }));
            }
            if (url) {
                return resolve(cloudinary.url(res.public_id.concat('.', res.format), fetchOptions));
            }
            return resolve();
        }));
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

        return new Promise((resolve, reject) => cloudinary.uploader.destroy(pubId, (err, res) => {
            if (err) {
                return reject(new common.errors.GhostError({
                    err: err,
                    message: `Could not delete image ${filename}`
                }));
            }
            return resolve(res);
        }));
    }

    /**
     *  @override
     */
    read(options) {
        const opts = options || {};
        return new Promise((resolve, reject) => request.get(opts.path, (err, res) => {
            if (err) {
                return reject(new common.errors.GhostError({
                    err: err,
                    message: `Could not read image ${opts.path}`
                }));
            }
            return resolve(res.body);
        }));
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
