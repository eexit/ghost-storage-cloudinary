'use strict';

var CloudinaryAdapter = require('../index'),
    nock = require('nock'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    cloudinary = require('cloudinary').v2,
    path = require('path'),
    fixtures = require(path.join(__dirname, '/fixtures')),
    cloudinaryAdapter = null;

describe('read', function () {
    it('should find the image', function (done) {
        cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig);
        var scope = nock('https://blog.mornati.net')
            .get('/myimage.png')
            .reply(200, {"body": "imagecontent"});

        var options = {"path": "https://blog.mornati.net/myimage.png"};

        cloudinaryAdapter.read(options).then(function (res) {
            done(scope.done());
        });
    });
});
