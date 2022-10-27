'use strict';

require('bluebird');

const _ = require('lodash'),
    debug = require('@tryghost/debug')('plugins:retinajs'),
    maxSupportedDpr = 5,
    sizeOf = require('image-size');

class RetinaJS {

    constructor(uploader, uploaderOptions, retinajsOptions) {
        this.uploader = uploader;
        this.uploaderOptions = uploaderOptions || {};
        this.retinajsOptions = retinajsOptions || {};
        this.retinajsOptions.baseWidth = parseInt(this.retinajsOptions.baseWidth, 10);
        this.retinajsOptions.fireForget = this.retinajsOptions.fireForget || false;

        debug('constructor:retinajsOptions', this.retinajsOptions);

        if (typeof this.uploader !== 'function') {
            throw new TypeError('RetinaJS: uploader must be callable');
        }

        if (typeof this.uploaderOptions.upload === 'undefined' ||
            typeof this.uploaderOptions.upload.public_id === 'undefined' ||
            this.uploaderOptions.upload.public_id.length === 0
        ) {
            throw new TypeError('RetinaJS error: invalid uploaderOptions.upload.public_id. Ensure to enable Cloudinary upload.use_filename option.');
        }

        if (isNaN(this.retinajsOptions.baseWidth)) {
            throw new TypeError('RetinaJS config error: invalid retinajs.baseWidth option');
        }

        if (this.retinajsOptions.baseWidth < 1) {
            throw new RangeError('RetinaJS config error: retinajs.baseWidth must be >= 1');
        }
    }

    /**
     *  Generates and creates the RetinaJS variants for given image
     *  @param {object} image The image object to retinize
     *  @return {Promise} A Promise
     */
    retinize(image) {
        const that = this,
            [head, ...tail] = this.generateDprConfigs(this.resolveMaxDpr(image.path));

        debug('retinize:configs', {
            head: head,
            tail: tail
        });

        // Image is not retinizable: creates DPR 1.0 variant only
        if (tail.length === 0) {
            return that.uploader(image.path, head, true);
        }

        // Creates the highest DPR variant first then creates subsequent variants
        return that.uploader(image.path, head, true).
            then((url) => {
                const variants = _.map(tail, (c) => that.uploader(url, c, false)),
                    // First creation call returns URL for highest DPR, in the post editor
                    // we need the DPR 1.0 variant (RetinaJS identifier-free) URL
                    finalUrl = that.sanitize(url);

                // Creates subsequent variants and returns URL regardless their fulfillment status
                if (that.retinajsOptions.fireForget) {
                    Promise.all(variants).catch((err) => {
                        console.error(new Error(`Fire&Forget RetinaJS: ${err}`));
                    });
                    return finalUrl;
                }

                // Waits for all subsequent variants to be done then returns the URL
                return Promise.all(variants).then(() => finalUrl);
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
     *  Resolves the max DPR index available for given filename and baseWidth configuration.
     *  If baseWidth configuration is set to 800 and filename image has a width of 2500,
     *  the value returned by this method will be 2500 / 800 = 3.125 => 3.
     *  @param {string} filename Image filename
     *  @return {int} Max available DPR index or:
     *      - 1 if image is smaller than baseWidth
     *      - maxSupportedDpr if image max DPR is higher than Cloudinary can support
     */
    resolveMaxDpr(filename) {
        const dim = sizeOf(filename),
            mdpr = Math.floor(dim.width / this.retinajsOptions.baseWidth);

        if (mdpr === 0) {
            return 1;
        }
        if (mdpr > maxSupportedDpr) {
            return maxSupportedDpr;
        }
        return mdpr;
    }

    /**
     *  Generates a collection of upload options derivated from the original
     *  upload otions for each variant in desc mode (highest DPR on the top).
     *  @param {int} dpr The highest DPR value
     *  @return {array} A collection customized upload options for all DPRs
     */
    generateDprConfigs(dpr) {
        if (dpr < 1) {
            throw new RangeError(`Unexpected dpr value: ${dpr}`);
        }

        const configs = [];
        for (let i = dpr; i >= 1; i -= 1) {
            // Deep clone
            const config = JSON.parse(JSON.stringify(Object.assign({}, this.uploaderOptions))),
                dprConfig = {
                    // Forces the image width to baseWidth
                    width: this.retinajsOptions.baseWidth,
                    // No scale-up!
                    if: `iw_gt_${this.retinajsOptions.baseWidth}`,
                    // Resizing method
                    crop: 'scale',
                    // The DPR will resize the image accordingly to its value
                    dpr: `${i}.0`,
                    // Tags the DPR index so you can browse the DPRs easily
                    tags: [`dpr${i}`]
                };

            // Builds the RetinaJS identifier (@{i}x) for variants
            // with DPR > 1.0
            if (i > 1) {
                dprConfig.public_id = `${config.upload.public_id}@${i}x`;
            }

            _.mergeWith(config.upload, dprConfig, (objv, srcv) => {
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
