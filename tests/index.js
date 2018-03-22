'use strict';
/* eslint global-require: 0 */
const path = require('path');

describe('Tests', function () {
    require(path.join(__dirname, 'adapter'));
    require(path.join(__dirname, 'plugins'));
});
