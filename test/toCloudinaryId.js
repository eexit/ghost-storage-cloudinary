'use strict';

var CloudinaryAdapter = require('../index'),
    chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    fixtures = require(path.join(__dirname, '/fixtures'));

describe('toCloudinaryId', function () {
    it ('returns correct ID (no folder)', function (done) {
        var cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig());
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
        var config = fixtures.sampleConfig();
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
