'use strict';
/* eslint global-require: 0 */
const path = require('path');

describe('CloudinaryAdapter', function () {
    require(path.join(__dirname, '/exists'));
    require(path.join(__dirname, '/save'));
    require(path.join(__dirname, '/serve'));
    require(path.join(__dirname, '/delete'));
    require(path.join(__dirname, '/read'));
    require(path.join(__dirname, '/toCloudinaryFile'));
    require(path.join(__dirname, '/toCloudinaryId'));
});
