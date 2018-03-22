'use strict';

class GhostError extends Error {
    constructor(options) {
        super(options.message);
    }
}

module.exports = {errors: {GhostError: GhostError}};
