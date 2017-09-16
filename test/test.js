var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var CloudinaryAdapter = require('../index');
var cloudinary = require('cloudinary');
var path = require('path');
var cloudinaryAdapter;

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
    }

    before(function () {
        config = {
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
        cloudinaryAdapter = new CloudinaryAdapter(config); 
        sinon.stub(cloudinary.uploader, 'upload');
    });

    beforeEach(function(done) {
        image = {
            path: path.join(__dirname, "favicon.png"),
            name: 'favicon.png',
            type: 'image/jpeg'
        };

        
        cloudinary.uploader.upload.callsArgWith(1, uploadExistsResult);

        sinon.stub(cloudinary, 'url').callsFake(function fakeFn() {
            return "https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png";
        });
        
        var promise = cloudinaryAdapter.save(image, "");
        promise.then(function(value){
            result = value;
            done();
        });
       
    });

    it("should report OK for upload", function(done){ 
        expect(result).equals("https://res.cloudinary.com/blog-mornati-net/image/upload/q_auto:good/favicon.png");
        done();
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
        config = {
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
        cloudinaryAdapter = new CloudinaryAdapter(config);
        sinon.stub(cloudinary.v2.api, 'resource');
    });

    it("should find an image", function(done){
        cloudinary.v2.api.resource.callsArgWith(2, undefined, resultExists);

        image = {
            path: path.join(__dirname, "favicon.png"),
            name: 'favicon.png',
            type: 'image/jpeg'
        };

        var promise = cloudinaryAdapter.exists(image.name);
        
        promise.then(function(value){
            expect(value).to.have.deep.property('public_id', "favicon");
            done();
        });
    });

    it("should not find an image", function(done){
        cloudinary.v2.api.resource.callsArgWith(2, {error: "error"}, undefined);

        image = {
            path: path.join(__dirname, "favicon.png"),
            name: 'favicon.png',
            type: 'image/jpeg'
        };

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
        config = {
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
        cloudinaryAdapter = new CloudinaryAdapter(config); 
        sinon.stub(cloudinary.uploader, 'destroy');
    });

    it("should delete image", function(done){ 
        image = {
            path: path.join(__dirname, "favicon.png"),
            name: 'favicon.png',
            type: 'image/jpeg'
        };
        cloudinary.uploader.destroy.callsArgWith(1, {"result":"ok"});
        var promise = cloudinaryAdapter.delete(image.name);
        
        promise.then(function(value){
            expect(value).to.have.deep.property('result', "ok");
            done();
        });
    });

    it("should raise an error", function(done){ 
        image = {
            path: path.join(__dirname, "missing_image.png"),
            name: 'missing_image.png',
            type: 'image/jpeg'
        };
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