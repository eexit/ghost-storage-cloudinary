'use strict';

const path = require('path');

/**
 *  Returns a sample API result payload for the upload endpoint
 *  @return {object} The API result sample object
 */
function sampleApiResult() {
    return {
        public_id: 'favicon',
        version: 1505580646,
        signature: 'd67f55bc2759623a5977c148942d33d7c55b55c9',
        width: 96,
        height: 96,
        format: 'png',
        resource_type: 'image',
        created_at: '2017-09-16T16:50:46Z',
        tags: [],
        bytes: 8708,
        type: 'upload',
        url: 'http://res.cloudinary.com/blog-mornati-net/image/upload/v1505580646/favicon.png',
        secure_url: 'https://res.cloudinary.com/blog-mornati-net/image/upload/v1505580646/favicon.png'
    };
}

/**
 *  Returns a plugin-free sample configuration for the adapter
 *  @return {object} The configuration object
 */
function sampleConfig() {
    return {
        "auth": {
            "cloud_name": "",
            "api_key": "",
            "api_secret": ""
        },
        "upload": {
            "use_filename": true,
            "unique_filename": false,
            "phash": true,
            "overwrite": false,
            "invalidate": true,
            "folder": "",
            "tags": []
        },
        "fetch": {
            "quality": "auto",
            "secure": false,
            "cdn_subdomain": false
        }
    };
}

/**
 *  Returns a sample configuration from the intial forked project
 *  @return {object} Legacy config object
 */
function sampleLegacyConfig() {
    return {
        "cloud_name": "",
        "api_key": "",
        "api_secret": "",
        "configuration": {
            "image": {
                "quality": "auto:good",
                "secure": true
            },
            "file": {
                "use_filename": true,
                "unique_filename": true,
                "phash": true,
                "overwrite": false,
                "invalidate": true
            }
        }
    };
}

/**
 *  Returns a fake image object off the provided imageFile and imageName.
 *  @param {string} imageFile The file path
 *  @param {string} imageName Optional file name, imageFile will be used if not set
 *  @return {object} The image object
 */
function generateImage(imageFile, imageName) {
    return {
        path: path.join(__dirname, imageFile),
        name: typeof imageName !== 'undefined' ? imageName : imageFile,
        type: 'image/png'
    };
}

module.exports = {
    sampleConfig: sampleConfig,
    sampleLegacyConfig: sampleLegacyConfig,
    sampleApiResult: sampleApiResult,
    mockImage: generateImage('favicon.png'),
    mockImageWithSpacesInName: generateImage('favicon.png', 'favicon with spaces.png'),
    mockInexistentImage: generateImage('not-found.png')
};
