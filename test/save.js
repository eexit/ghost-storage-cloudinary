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

describe('save', function () {
    before(function () {
        cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig());
    });

    it('should upload successfully', function (done) {
        var expectedUploadConfig = {
            "use_filename": true,
            "unique_filename": false,
            "phash": true,
            "overwrite": false,
            "invalidate": true,
            "folder": "",
            "tags": [],
            "public_id": "favicon"
        };

        sinon.stub(cloudinary.uploader, 'upload');
        cloudinary.uploader.upload
            .withArgs(fixtures.mockImage.path, expectedUploadConfig, sinon.match.any)
            .callsArgWith(2, undefined, fixtures.sampleApiResult());

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon.png';
        });

        cloudinaryAdapter.save(fixtures.mockImage).then(function (url) {
            expect(url).to.equals('http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon.png');
            done();
        });
    });

    it('should upload successfully with legacy config', function (done) {
        var cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleLegacyConfig());
        var expectedUploadConfig = {
            "use_filename": true,
            "unique_filename": true,
            "phash": true,
            "overwrite": false,
            "invalidate": true,
            "public_id": "favicon"
        };

        sinon.stub(cloudinary.uploader, 'upload');
        cloudinary.uploader.upload
            .withArgs(fixtures.mockImage.path, expectedUploadConfig, sinon.match.any)
            .callsArgWith(2, undefined, fixtures.sampleApiResult());

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png';
        });

        cloudinaryAdapter.save(fixtures.mockImage).then(function (url) {
            expect(url).to.equals('https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png');
            done();
        });
    });

    it('should normalize image name', function (done) {
        var expectedUploadConfig = {
            "use_filename": true,
            "unique_filename": false,
            "phash": true,
            "overwrite": false,
            "invalidate": true,
            "folder": "",
            "tags": [],
            "public_id": "favicon-with-spaces"
        };

        sinon.stub(cloudinary.uploader, 'upload')
            .withArgs(fixtures.mockImageWithSpacesInName.path, expectedUploadConfig, sinon.match.any)
            .callsArgWith(2, undefined, fixtures.sampleApiResult());

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon-with-spaces.png';
        });

        cloudinaryAdapter.save(fixtures.mockImageWithSpacesInName).then(function (url) {
            expect(url).equals('http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon-with-spaces.png');
            done();
        });
    });

    it('should upload successfully with tags and folder', function (done) {
        var config = fixtures.sampleConfig();
        config.upload.folder = 'blog.eexit.net/v3';
        config.upload.tags = ['foo', 'bar'];
        cloudinaryAdapter = new CloudinaryAdapter(config);

        var expectedUploadConfig = {
            "use_filename": true,
            "unique_filename": false,
            "phash": true,
            "overwrite": false,
            "invalidate": true,
            "folder": "blog.eexit.net/v3",
            "tags": ["foo", "bar"],
            "public_id": "favicon"
        };

        var apiResult = Object.assign(fixtures.sampleApiResult(), {
            public_id: 'blog.eexit.net/v3/favicon',
            tags: ['foo', 'bar'],
            url: 'http://res.cloudinary.com/blog-mornati-net/image/upload/v1505580646/blog.eexit.net/v3/favicon.png',
            secure_url: 'https://res.cloudinary.com/blog-mornati-net/image/upload/v1505580646/blog.eexit.net/v3/favicon.png'
        });

        sinon.stub(cloudinary.uploader, 'upload')
            .withArgs(fixtures.mockImage.path, expectedUploadConfig, sinon.match.any)
            .callsArgWith(2, undefined, apiResult);

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/blog.eexit.net/v3/favicon.png';
        });

        cloudinaryAdapter.save(fixtures.mockImage).then(function (url) {
            expect(url).equals('http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/blog.eexit.net/v3/favicon.png');
            done();
        });
    });

    afterEach(function () {
         // Unwraps the spy
        cloudinary.uploader.upload.restore();
        cloudinary.url.restore();
    });
});
