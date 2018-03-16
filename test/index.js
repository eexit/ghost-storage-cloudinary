'use strict';

var CloudinaryAdapter = require('../index'),
    nock = require('nock'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    cloudinary = require('cloudinary').v2,
    path = require('path'),
    request = require('request'),
    cloudinaryAdapter = null;


var baseConfig = function () {
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
};

var legacyConfig = function () {
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
};

function generateImage(imageFile, imageName) {
    imageName = typeof imageName !== 'undefined' ? imageName : imageFile;
    return {
        path: path.join(__dirname, imageFile),
        name: imageName,
        type: 'image/png'
    };
}

describe('Image Upload', function () {
    var apiResult = {
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

    before(function () {
        cloudinaryAdapter = new CloudinaryAdapter(baseConfig());
    });

    it('should upload successfully', function (done) {
        var image = generateImage('favicon.png');
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
            .withArgs(image.path, expectedUploadConfig, sinon.match.any)
            .callsArgWith(2, undefined, apiResult);

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon.png';
        });

        cloudinaryAdapter.save(image).then(function (url) {
            expect(url).to.equals('http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon.png');
            done();
        });
    });

    it('should upload successfully with legacy config', function (done) {
        var cloudinaryAdapter = new CloudinaryAdapter(legacyConfig());

        var image = generateImage('favicon.png');
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
            .withArgs(image.path, expectedUploadConfig, sinon.match.any)
            .callsArgWith(2, undefined, apiResult);

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png';
        });

        cloudinaryAdapter.save(image).then(function (url) {
            expect(url).to.equals('https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png');
            done();
        });
    });

    it('should normalize image name', function (done) {
        var image = generateImage('favicon.png', 'favicon with spaces.png');
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
            .withArgs(image.path, expectedUploadConfig, sinon.match.any)
            .callsArgWith(2, undefined, apiResult);

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon-with-spaces.png';
        });

        cloudinaryAdapter.save(image).then(function (url) {
            expect(url).equals('http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/favicon-with-spaces.png');
            done();
        });
    });

    it('should upload successfully with tags and folder', function (done) {
        var config = baseConfig();
        config.upload.folder = 'blog.eexit.net/v3';
        config.upload.tags = ['foo', 'bar'];
        cloudinaryAdapter = new CloudinaryAdapter(config);

        var image = generateImage('favicon.png');
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
        var apiResult2 = Object.assign(apiResult, {
            public_id: 'blog.eexit.net/v3/favicon',
            tags: ['foo', 'bar'],
            url: 'http://res.cloudinary.com/blog-mornati-net/image/upload/v1505580646/blog.eexit.net/v3/favicon.png',
            secure_url: 'https://res.cloudinary.com/blog-mornati-net/image/upload/v1505580646/blog.eexit.net/v3/favicon.png'
        });

        sinon.stub(cloudinary.uploader, 'upload')
            .withArgs(image.path, expectedUploadConfig, sinon.match.any)
            .callsArgWith(2, undefined, apiResult2);

        sinon.stub(cloudinary, 'url').callsFake(function urlStub() {
            return 'http://res.cloudinary.com/blog-mornati-net/image/upload/q_auto/blog.eexit.net/v3/favicon.png';
        });

        cloudinaryAdapter.save(image).then(function (url) {
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

describe('Image Exists', function () {
    var apiResult = {
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

    before(function () {
        cloudinaryAdapter = new CloudinaryAdapter(baseConfig());
        sinon.stub(cloudinary.uploader, 'explicit');
    });

    it('returns true when image exists', function (done) {
        var image = generateImage('favicon.png');
        cloudinary.uploader.explicit.callsArgWith(2, undefined, apiResult);

        cloudinaryAdapter.exists(image.name).then(function (exists) {
            expect(exists).to.equals(true);
            done();
        });
    });

    it('returns false when image does not exist', function (done) {
        var image = generateImage('not_found.png');
        cloudinary.uploader.explicit.callsArgWith(2, {error: "error"}, undefined);

        cloudinaryAdapter.exists(image.name).then(function (exists) {
            expect(exists).to.equals(false);
            done();
        });
    });
});

describe('Image Delete', function () {
    before(function () {
        cloudinaryAdapter = new CloudinaryAdapter(baseConfig());
        sinon.stub(cloudinary.uploader, 'destroy');
    });

    it('should delete image successfully', function (done) {
        var image = generateImage('favicon.png');
        cloudinary.uploader.destroy.callsArgWith(1, undefined, {response: "whatever the api returns as a response"});

        cloudinaryAdapter.delete(image.name).then(function (res) {
            expect(res).to.deep.equal({response: "whatever the api returns as a response"});
            done();
        });
    });

    it('returns an error when delete image fails', function (done) {
        var image = generateImage('not_found.png');
        cloudinary.uploader.destroy.callsArgWith(1, {error: "error"}, undefined);

        cloudinaryAdapter.delete(image.name)
            .then(function () {
                done('expected error');
            })
            .catch(function (ex) {
                expect(ex).to.be.an.instanceOf(Error);
                done();
            });
    });
});

describe('Image Read', function () {
    it('should find the image', function (done) {
        cloudinaryAdapter = new CloudinaryAdapter(baseConfig());

        var scope = nock('https://blog.mornati.net')
            .get('/myimage.png')
            .reply(200, {"body": "imagecontent"});

        var options = {"path": "https://blog.mornati.net/myimage.png"};

        cloudinaryAdapter.read(options).then(function (res) {
            done(scope.done());
        });
    });
});

describe('toCloudinaryFile', function () {
    it ('returns correct file name (no folder)', function (done) {
        var cloudinaryAdapter = new CloudinaryAdapter(baseConfig());
        var tests = [
            ['foo.jpg', 'foo.jpg'],
            ['./foo/bar.png', 'bar.png'],
            ['http://www.example.com/image.tiff', 'image.tiff']
        ];

        for (let [input, expected] of tests) {
            expect(cloudinaryAdapter.toCloudinaryFile(input)).to.equals(expected);
        }
        done();
    });

    it ('returns correct file name (with folder)', function (done) {
        var config = baseConfig();
        config.upload.folder = 'test/blog';
        var cloudinaryAdapter = new CloudinaryAdapter(config);
        var tests = [
            ['foo.jpg', 'test/blog/foo.jpg'],
            ['./foo/bar.png', 'test/blog/bar.png'],
            ['http://www.example.com/image.tiff', 'test/blog/image.tiff']
        ];

        for (let [input, expected] of tests) {
            expect(cloudinaryAdapter.toCloudinaryFile(input)).to.equals(expected);
        }
        done();
    });
});

describe('toCloudinaryId', function () {
    it ('returns correct ID (no folder)', function (done) {
        var cloudinaryAdapter = new CloudinaryAdapter(baseConfig());
        var tests = [
            ['foo.jpg', 'foo'],
            ['./foo/bar.png', 'bar'],
            ['http://www.example.com/image.tiff', 'image']
        ];

        for (let [input, expected] of tests) {
            expect(cloudinaryAdapter.toCloudinaryId(input)).to.equals(expected);
        }
        done();
    });

    it ('returns correct ID (with folder)', function (done) {
        var config = baseConfig();
        config.upload.folder = 'test/blog';
        var cloudinaryAdapter = new CloudinaryAdapter(config);
        var tests = [
            ['foo.jpg', 'test/blog/foo'],
            ['./foo/bar.png', 'test/blog/bar'],
            ['http://www.example.com/image.tiff', 'test/blog/image']
        ];

        for (let [input, expected] of tests) {
            expect(cloudinaryAdapter.toCloudinaryId(input)).to.equals(expected);
        }
        done();
    });
});

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
