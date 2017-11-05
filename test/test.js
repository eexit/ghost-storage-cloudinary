var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var CloudinaryAdapter = require('../index');
var cloudinary = require('cloudinary');
var path = require('path');
var cloudinaryAdapter;
var request = require('request');

var baseConfig = {
    "configuration": {
        "image": {
            "quality": "auto:good",
            "secure": "true"
        },
        "file": {
            "use_filename": "true", 
            "unique_filename": "false", 
            "phash": "true", 
            "overwrite": "false", 
            "invalidate": "true"
        }       
    }
  };

function generateImage(imageFile, imageName) {
    imageName = typeof imageName !== 'undefined' ? imageName : imageFile;
    return {
        path: path.join(__dirname, imageFile),
        name: imageName,
        type: 'image/jpeg'
    };
}

describe('Image Upload', function () {
    var result = false;

    var uploadExistsResult = { 
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
        secure_url: 'https://res.cloudinary.com/blog-mornati-net/image/upload/v1505580646/favicon.png',
        existing: true 
    };

    before(function () {
        cloudinaryAdapter = new CloudinaryAdapter(baseConfig); 
    });

    it("should report OK for upload", function(done){ 
        image = generateImage("favicon.png");

        sinon.stub(cloudinary.uploader, 'upload');
        cloudinary.uploader.upload.callsArgWith(1, uploadExistsResult);
        sinon.stub(cloudinary, 'url').callsFake(function fakeFn() {
            return "https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png";
        });
        
        var promise = cloudinaryAdapter.save(image, "");
        promise.then(function(value){
            result = value;
            expect(result).equals("https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png");
            done();
        });

    });

    it("should remove spaces before upload", function(done){ 
        image = generateImage("favicon.png", "favicon with spaces.png");
        console.log(image);
        var expectedConfig = { 
            use_filename: 'true',
            unique_filename: 'false',
            phash: 'true',
            overwrite: 'false',
            invalidate: 'true',
            public_id: 'favicon-with-spaces' 
        };

        sinon.stub(cloudinary.uploader, 'upload').withArgs(image.path, sinon.match.any, expectedConfig).callsArgWith(1, uploadExistsResult);
        sinon.stub(cloudinary, 'url').callsFake(function fakeFn() {
            return "https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon-with-spaces.png";
        });

        var promise = cloudinaryAdapter.save(image, "");
        promise.then(function(value){
            result = value;
            expect(result).equals("https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon-with-spaces.png");
            done();
        });
    });

    afterEach(function () {
        cloudinary.uploader.upload.restore(); // Unwraps the spy
        cloudinary.url.restore();
    });
  
    after(function () {
  
    });
});

describe('Image Exists', function () {
    var result = false;

    var resultExists = { 
        public_id: 'favicon',
        format: 'png',
        version: 1505580968,
        resource_type: 'image',
        type: 'upload',
        created_at: '2017-09-16T16:56:08Z',
        bytes: 8708,
        width: 96,
        height: 96,
        url: 'http://res.cloudinary.com/blog-mornati-net/image/upload/v1505580968/favicon.png',
        secure_url: 'https://res.cloudinary.com/blog-mornati-net/image/upload/v1505580968/favicon.png',
        next_cursor: '66902c8d3e20eb6ad26fd1cd3ada3188',
        derived:
        [ { transformation: 't_media_lib_thumb',
            format: 'png',
            bytes: 5473,
            id: 'd3b76a74b046c9fafaf2254d9bb7feab',
            url: 'http://res.cloudinary.com/blog-mornati-net/image/upload/t_media_lib_thumb/v1505580968/favicon.png',
            secure_url: 'https://res.cloudinary.com/blog-mornati-net/image/upload/t_media_lib_thumb/v1505580968/favicon.png' } ],
        rate_limit_allowed: 500,
        rate_limit_reset_at: "2017-09-16T19:00:00.000Z",
        rate_limit_remaining: 499 
    };

    before(function () {
        cloudinaryAdapter = new CloudinaryAdapter(baseConfig);
        sinon.stub(cloudinary.v2.api, 'resource');
    });

    it("should find an image", function(done){
        cloudinary.v2.api.resource.callsArgWith(2, undefined, resultExists);

        image = generateImage("favicon.png");

        var promise = cloudinaryAdapter.exists(image.name);
        
        promise.then(function(value){
            expect(value).to.have.deep.property('public_id', "favicon");
            done();
        });
    });

    it("should not find an image", function(done){
        cloudinary.v2.api.resource.callsArgWith(2, {error: "error"}, undefined);

        image = generateImage("favicon.png");

        var promise = cloudinaryAdapter.exists(image.name);
        
        promise.then(function(value){
            expect(value).equals(false);
            done();
        });
    });
  
    after(function () {
  
    });
});

describe('Image Delete', function () {
    var result = false;

    before(function () {
        cloudinaryAdapter = new CloudinaryAdapter(baseConfig); 
        sinon.stub(cloudinary.uploader, 'destroy');
    });

    it("should delete image", function(done){
        image = generateImage("favicon.png");
        cloudinary.uploader.destroy.callsArgWith(1, {"result":"ok"});
        var promise = cloudinaryAdapter.delete(image.name);
        
        promise.then(function(value){
            expect(value).to.have.deep.property('result', "ok");
            done();
        });
    });

    it("should raise an error", function(done){
        image = generateImage("missing_image.png");
        cloudinary.uploader.destroy.callsArgWith(1, {"result":"not found"});
        var promise = cloudinaryAdapter.delete(image.name);
        
        promise.then(function(value){
            expect(value).to.have.deep.property('result', "not found");
            done();
        });
    });
  
    after(function () {
  
    });
  });

  describe('Image Read', function () {

    before(function () {
        
    });

    it("should find the image", function(done){
        var res = {"body": "imagecontent"};
        sinon.stub(request, 'get').yields(undefined, JSON.stringify(res));
        var options = {"path": "https://blog.mornati.net/myimage.png"};
        var promise = cloudinaryAdapter.read(options);
        
        promise.then(function(value){
            done();
        });
    });
  
    after(function () {
  
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