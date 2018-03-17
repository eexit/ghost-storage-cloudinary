'use strict';

var CloudinaryAdapter = require('../index'),
    chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    fixtures = require(path.join(__dirname, '/fixtures'));

describe('toCloudinaryFile', function () {
    it ('returns correct file name (no folder)', function (done) {
        var config = fixtures.sampleConfig();
        delete config.upload.folder;
        var cloudinaryAdapter = new CloudinaryAdapter(config);
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
        var config = fixtures.sampleConfig();
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
