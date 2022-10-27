'use strict';

const _ = require('lodash'),
    GhostInternalError = require('@tryghost/errors').InternalServerError;

module.exports = {
    CloudinaryAdapterError: class CloudinaryAdapterError extends GhostInternalError {
        constructor(options) {
            super(_.merge({
                errorType: 'ImageStorageAdapterError',
                message: 'An error has occurred while handling image storage.',
                level: 'error'
            }, options));
        }
    }
};
