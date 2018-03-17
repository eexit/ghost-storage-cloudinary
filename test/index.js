'use strict';

var path = require('path');

describe('CloudinaryAdapter', function () {
    require(path.join(__dirname, '/exists'));
    require(path.join(__dirname, '/save'));
    require(path.join(__dirname, '/serve'));
    require(path.join(__dirname, '/delete'));
    require(path.join(__dirname, '/read'));
    require(path.join(__dirname, '/toCloudinaryFile'));
    require(path.join(__dirname, '/toCloudinaryId'));
    require('mocha-jshint')({
        git: {
            modified: true,
            commits: 2,
            exec: {
                maxBuffer: 20*1024*1024
            }
        },
        pretty: true,
        paths: [
            'index.js',
            'test/*.js',
            'lib/*.js'
        ]
    });
});
