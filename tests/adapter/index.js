'use strict';
/* eslint global-require: 0 */
const path = require('path');

describe('CloudinaryAdapter', function () {
    for (const f of ['exists', 'save', 'serve', 'delete', 'read', 'toCloudinaryFile', 'toCloudinaryId']) {
        require(path.join(__dirname, f));
    }
});
