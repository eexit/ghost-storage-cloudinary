'use strict';

require('bluebird');

const _ = require('lodash'),
    sizeOf = require('image-size'),
    maxSupportedDrp = 5;

class RetinaJS {

    constructor(uploader, uploadOptions, rjsOptions) {
        this.uploader = uploader;
        this.uploadOptions = uploadOptions || {};
        this.rjsOptions = rjsOptions || {};
        this.rjsOptions.baseWidth = parseInt(this.rjsOptions.baseWidth, 10);
        this.rjsOptions.fireForget = this.rjsOptions.fireForget || false;

        if (typeof this.uploader !== 'function') {
            throw new TypeError('RetinaJS: uploader must be callable');
        }

        if (typeof this.uploadOptions.public_id === 'undefined' || this.uploadOptions.public_id.length === 0) {
            throw new TypeError('RetinaJS error: invalid uploadOptions.public_id');
        }

        if (isNaN(this.rjsOptions.baseWidth)) {
            throw new TypeError('RetinaJS config error: invalid rjs.baseWidth option');
        }

        if (this.rjsOptions.baseWidth < 1) {
            throw new RangeError('RetinaJS config error: rjs.baseWidth must be >= 1');
        }
    }

    retinize(filename) {
        const that = this,
            [head, ...tail] = this.generateDprConfigs(this.resolveMaxDpr(filename.path));

        // Image is not retinizable: only upload DPR 1.0
        if (tail.length === 0) {
            return that.uploader(filename, head, true);
        }

        // Uploads the highest DRP index first then cascade with others
        return that.uploader(filename, head, true).
            then((url) => {
                const tasks = _.map(tail, (c) => that.uploader(url, c, false)),
                    // As the head call return URL is a DPR image, removes the retinajs
                    // identifier of the URL (strips "@{i}x")
                    finalUrl = that.sanitize(url);

                // Triggers remaining uploads and returned URL ignoring if they fail or not
                if (that.rjsOptions.fireForget) {
                    Promise.all(tasks).catch((err) => {
                        console.error(new Error(`Fire&Forget RetinaJS: ${err}`));
                    });
                    return finalUrl;
                }

                // Waits for all uploads to be done before returning the URL
                return Promise.all(tasks).then(() => finalUrl);
            });
    }

    /**
     *  Removes the latest RetinaJS identifier (@{i}x) from the given string
     *  @param {string} string A string
     *  @return {string} The sanitized string
     */
    sanitize(string) {
        return decodeURIComponent(string).replace(/@\dx(?!.*@\dx)/, '');
    }

    /**
     *  Resolves the max DPR available for given filename and baseWidth configuration.
     *  If baseWidth configuration is set to 800 and filename image has a width of 2500,
     *  the value returned by this method will be 2500 / 800 = 3.125 => 3.
     *  @param {string} filename Image filename
     *  @return {int} Max available DPR index or:
     *      - 1 if image is smaller than baseWidth
     *      - maxSupportedDrp if image max DPR is higher than Cloudinary can support
     */
    resolveMaxDpr(filename) {
        const dim = sizeOf(filename),
            mdpr = Math.floor(dim.width / this.rjsOptions.baseWidth);

        if (mdpr === 0) {
            return 1;
        }
        if (mdpr > maxSupportedDrp) {
            return maxSupportedDrp;
        }
        return mdpr;
    }

    /**
     *  Generates a collection of uploadOptions derivated from the original
     *  uploadOptions for each DPR index.
     *  @param {int} dpr A DPR index returned by resolveMaxDpr()
     *  @return {array} A collection customized uploadOptions for all DPRs
     */
    generateDprConfigs(dpr) {
        if (dpr < 1) {
            throw new RangeError(`Unexpected dpr value: ${dpr}`);
        }

        const configs = [];
        for (let i = dpr; i >= 1; i -= 1) {
            const config = Object.assign({}, this.uploadOptions),
                dprConfig = {
                    // Forces the image width to wanted baseWidth
                    width: this.rjsOptions.baseWidth,
                    // Resizing method
                    crop: 'scale',
                    // The DPR will resize the image accordingly to its value
                    dpr: `${i}.0`,
                    // Tags the DPR index so you can browse the DPRs easily
                    tags: [`dpr${i}`]
                };

            // Mutates the public_id for DPR > 1 in order
            // to match the retinajs identifier (public_id@{dpr}x.ext)
            if (i > 1) {
                dprConfig.public_id = `${config.public_id}@${i}x`;
            }

            // Merges DPR generated config into uploadOptions
            _.mergeWith(config, dprConfig, (objv, srcv) => {
                if (_.isArray(objv)) {
                    return objv.concat(srcv);
                }
                return srcv;
            });
            configs.push(config);
        }
        return configs;
    }
}

module.exports = RetinaJS;
