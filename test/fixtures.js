'use strict';

var path = require('path');

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
        "display": {
            "quality": "auto",
            "secure": false,
            "cdn_subdomain": false
        }
    };
}

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

function generateImage(imageFile, imageName) {
    imageName = typeof imageName !== 'undefined' ? imageName : imageFile;
    return {
        path: path.join(__dirname, imageFile),
        name: imageName,
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
