'use strict';

const path = require('path');

/**
 *  Returns an image object off the provided filename.
 *  Note: the filename must exist!
 *  @param {string} filename The filename
 *  @return {object} The image object
 */
function generateImage(filename) {
    const parsed = path.parse(path.join(__dirname, filename));
    parsed.type = 'image/png';
    parsed.path = path.join(parsed.dir, parsed.base);
    return parsed;
}

module.exports = {mockImage: generateImage('500x250.png')};
