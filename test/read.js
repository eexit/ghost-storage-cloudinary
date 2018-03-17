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

    it('should return an error on empty options', function (done) {
        cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig);

        cloudinaryAdapter.read()
            .then(function (res) {
                done('expected error');
            })
            .catch(function (ex) {
                expect(ex).to.be.an.instanceOf(Error);
                expect(ex.message).to.equal('Could not read image undefined');
                done();
            });
    });

    it('should return an error on inexistent resource', function (done) {
        cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig);
        var scope = nock('https://blog.mornati.net')
            .get('/myimage.png')
            .replyWithError('some error occurred');

        var options = {"path": "https://blog.mornati.net/myimage.png"};

        cloudinaryAdapter.read(options)
            .then(function (res) {
                done('expected error');
            })
            .catch(function (ex) {
                expect(ex).to.be.an.instanceOf(Error);
                expect(ex.message).to.equal('Could not read image https://blog.mornati.net/myimage.png');
                done(scope.done());
            });
    });
});
