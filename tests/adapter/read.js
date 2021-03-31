'use strict';

const nock = require('nock'),
    chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    CloudinaryAdapter = require(path.join(__dirname, '../../')),
    common = require(path.join(__dirname, '../../errors')),
    fixtures = require(path.join(__dirname, 'fixtures'));

let cloudinaryAdapter = null;

describe('read', function () {
    it('should find the image', function (done) {

        cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig);
        const scope = nock('https://blog.mornati.net')
                .get('/myimage.png')
                .reply(200, { "body": "imagecontent" }),
            options = { "path": "https://blog.mornati.net/myimage.png" };

        cloudinaryAdapter.read(options).then(function () {
            done(scope.done());
        });
    });

    it('should return an error on empty options', function (done) {
        cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig);
        cloudinaryAdapter.read()
            .then(function () {
                done('expected error');
            })
            .catch(function (ex) {
                expect(ex).to.be.an.instanceOf(common.errors.GhostError);
                expect(ex.message).to.equal('Could not read image undefined');
                done();
            });
    });

    it('should return an error on inexistent resource', function (done) {
        const scope = nock('https://blog.mornati.net')
                .get('/myimage.png')
                .replyWithError('some error occurred'),
            options = { "path": "https://blog.mornati.net/myimage.png" };

        cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig);
        cloudinaryAdapter.read(options)
            .then(function () {
                done('expected error');
            })
            .catch(function (ex) {
                expect(ex).to.be.an.instanceOf(common.errors.GhostError);
                expect(ex.message).to.equal('Could not read image https://blog.mornati.net/myimage.png');
                done(scope.done());
            });
    });
});
