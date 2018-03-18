'use strict';

class GhostError extends Error {
    constructor(options) {
        super();
        this.err = options.err || null;
        this.message = options.message || "";
    }
}

module.exports = {errors: {GhostError: GhostError}};
