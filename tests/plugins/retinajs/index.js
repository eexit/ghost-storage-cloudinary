'use strict';
/* eslint global-require: 0 */
const path = require('path');

describe('RetinaJS', function () {
    for (const f of ['constructor', 'retinize', 'sanitize', 'resolveMaxDpr', 'generateDprConfigs']) {
        require(path.join(__dirname, f));
    }
});
