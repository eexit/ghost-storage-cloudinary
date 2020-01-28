'use strict';

const chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    cloudinary = require('cloudinary').v2,
    path = require('path'),
    moment = require('moment'),
    CloudinaryAdapter = require(path.join(__dirname, '../../')),
    common = require(path.join(__dirname, '../../errors')),
    fixtures = require(path.join(__dirname, 'fixtures'));

let cloudinaryAdapter = null;

describe('save', function () {
    before(function () {
        cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig());
    });

    it('should upload successfully', function (done) {
        const expectedUploadConfig = {
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
            .callsArgWith(2, null, fixtures.sampleApiResult());

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon.png';
        });

        cloudinaryAdapter.save(fixtures.mockImage).then(function (url) {
            expect(url).to.equals('http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon.png');
            done();
        });
    });

    it('should upload successfully and generate random public id', function (done) {
        /* eslint one-var: ["error", "consecutive"] */
        const configForRandomPublicId = fixtures.sampleConfig(),
            apiResult = fixtures.sampleApiResult();

        configForRandomPublicId.upload.use_filename = false;
        apiResult.public_id = '06e288276dbab60c5fe48a51b03735b2';

        const adapter = new CloudinaryAdapter(configForRandomPublicId),
            expectedUploadConfig = {
                "use_filename": false,
                "unique_filename": false,
                "phash": true,
                "overwrite": false,
                "invalidate": true,
                "folder": "",
                "tags": []
            };

        sinon.stub(cloudinary.uploader, 'upload');
        cloudinary.uploader.upload
            .withArgs(fixtures.mockImage.path, expectedUploadConfig, sinon.match.any)
            .callsArgWith(2, null, apiResult);

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/06e288276dbab60c5fe48a51b03735b2.png';
        });

        adapter.save(fixtures.mockImage).then(function (url) {
            expect(url).to.equals('http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/06e288276dbab60c5fe48a51b03735b2.png');
            done();
        });
    });

    it('should upload successfully with legacy config', function (done) {
        const adapter = new CloudinaryAdapter(fixtures.sampleLegacyConfig()),
            expectedUploadConfig = {
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
            .callsArgWith(2, null, fixtures.sampleApiResult());

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png';
        });

        adapter.save(fixtures.mockImage).then(function (url) {
            expect(url).to.equals('https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png');
            done();
        });
    });

    it('should normalize image name', function (done) {
        const expectedUploadConfig = {
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
            .callsArgWith(2, null, fixtures.sampleApiResult());

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon-with-spaces.png';
        });

        cloudinaryAdapter.save(fixtures.mockImageWithSpacesInName).then(function (url) {
            expect(url).equals('http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon-with-spaces.png');
            done();
        });
    });

    it('should upload successfully with tags and folder', function (done) {
        let config = fixtures.sampleConfig();
        config.upload.folder = 'blog.eexit.net/v3';
        config.upload.tags = ['foo', 'bar'];

        cloudinaryAdapter = new CloudinaryAdapter(config);

        const expectedUploadConfig = {
                "use_filename": true,
                "unique_filename": false,
                "phash": true,
                "overwrite": false,
                "invalidate": true,
                "folder": "blog.eexit.net/v3",
                "tags": ["foo", "bar"],
                "public_id": "favicon"
            },
            apiResult = Object.assign(fixtures.sampleApiResult(), {
                public_id: 'blog.eexit.net/v3/favicon',
                tags: ['foo', 'bar'],
                url: 'http://res.cloudinary.com/blog-mornati-net/image/upload/v1505580646/blog.eexit.net/v3/favicon.png',
                secure_url: 'https://res.cloudinary.com/blog-mornati-net/image/upload/v1505580646/blog.eexit.net/v3/favicon.png'
            });

        sinon.stub(cloudinary.uploader, 'upload')
            .withArgs(fixtures.mockImage.path, expectedUploadConfig, sinon.match.any)
            .callsArgWith(2, null, apiResult);

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/blog.eexit.net/v3/favicon.png';
        });

        cloudinaryAdapter.save(fixtures.mockImage).then(function (url) {
            expect(url).equals('http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/blog.eexit.net/v3/favicon.png');
            done();
        });
    });

    it('should upload successfully in a dated folder at root', function (done) {
        let config = fixtures.sampleConfig();
        config.useDatedFolder = true;
        cloudinaryAdapter = new CloudinaryAdapter(config);

        const
            date = moment(),
            year = date.format('YYYY'),
            month = date.format('MM'),
            expectedUploadConfig = {
                "folder": `${year}/${month}`,
                "public_id": "favicon"
            },
            apiResult = Object.assign(fixtures.sampleApiResult(), {
                public_id: `${year}/${month}/favicon`,
                url: `http://res.cloudinary.com/foo/image/upload/v1/${year}/${month}/favicon.png`
            });

        sinon.stub(cloudinary.uploader, 'upload')
            .withArgs(fixtures.mockImage.path, sinon.match(expectedUploadConfig), sinon.match.any)
            .callsArgWith(2, null, apiResult);

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return `http://res.cloudinary.com/foo/image/upload/v1/${year}/${month}/favicon.png`;
        });

        cloudinaryAdapter.save(fixtures.mockImage).then(function (url) {
            expect(url).equals(`http://res.cloudinary.com/foo/image/upload/v1/${year}/${month}/favicon.png`);
            done();
        });
    });

    it('should upload successfully in a dated folder in subfolder', function (done) {
        let config = fixtures.sampleConfig();
        config.useDatedFolder = true;
        config.upload.folder = 'blog/eexit.net';
        cloudinaryAdapter = new CloudinaryAdapter(config);

        const
            date = moment(),
            year = date.format('YYYY'),
            month = date.format('MM'),
            expectedUploadConfig = {
                "folder": `blog/eexit.net/${year}/${month}`,
                "public_id": "favicon"
            },
            apiResult = Object.assign(fixtures.sampleApiResult(), {
                public_id: `blog/eexit.net/${year}/${month}/favicon`,
                url: `http://res.cloudinary.com/foo/image/upload/v1/blog/eexit.net/${year}/${month}/favicon.png`
            });

        sinon.stub(cloudinary.uploader, 'upload')
            .withArgs(fixtures.mockImage.path, sinon.match(expectedUploadConfig), sinon.match.any)
            .callsArgWith(2, null, apiResult);

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return `http://res.cloudinary.com/foo/image/upload/v1/blog/eexit.net/${year}/${month}/favicon.png`;
        });

        cloudinaryAdapter.save(fixtures.mockImage).then(function (url) {
            expect(url).equals(`http://res.cloudinary.com/foo/image/upload/v1/blog/eexit.net/${year}/${month}/favicon.png`);
            done();
        });
    });

    it('should return an error on api upload failure', function (done) {
        sinon.stub(cloudinary.uploader, 'upload');
        sinon.stub(cloudinary, 'url');
        cloudinary.uploader.upload.callsArgWith(2, {error: "some error"});

        cloudinaryAdapter.save(fixtures.mockImage)
            .then(function () {
                done('expected error');
            })
            .catch(function (ex) {
                expect(ex).to.be.an.instanceOf(common.errors.GhostError);
                expect(ex.message).to.equal(`Could not upload image ${fixtures.mockImage.path}`);
                done();
            });
    });

    it('should upload successfully with RetinaJS plugin', function (done) {
        const config = fixtures.sampleConfig();
        config.rjs = {baseWidth: 48};

        cloudinaryAdapter = new CloudinaryAdapter(config);

        sinon.stub(cloudinary.uploader, 'upload').callsArgWith(2, null, fixtures.sampleApiResult());
        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png';
        });

        cloudinaryAdapter.save(fixtures.mockImage)
            .then(function (url) {
                expect(url).equals('https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png');
                expect(cloudinary.uploader.upload.callCount).to.equal(2, 'cloudinary.uploader.upload should have been called 2 times');
                expect(cloudinary.url.callCount).to.equal(1, 'cloudinary.url should have been called 1 time');
                done();
            });
    });

    afterEach(function () {
        // Unwraps the spy
        cloudinary.uploader.upload.restore();
        cloudinary.url.restore();
    });
});
