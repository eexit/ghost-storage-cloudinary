'use strict';

const chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    CloudinaryAdapter = require(path.join(__dirname, '../../')),
    fixtures = require(path.join(__dirname, 'fixtures'));

describe('toCloudinaryId', function () {
    it('returns correct ID (no folder)', function (done) {
        const cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig()),
            tests = [
                ['foo.jpg', 'foo'],
                ['./foo/bar.png', 'bar'],
                ['http://www.example.com/image.tiff', 'image']
            ];

        for (const [input, expected] of tests) {
            expect(cloudinaryAdapter.toCloudinaryId(input)).to.equals(expected);
        }
        done();
    });

    it('returns correct ID (with folder)', function (done) {
        let config = fixtures.sampleConfig();
        config.upload.folder = 'test/blog';
        const cloudinaryAdapter = new CloudinaryAdapter(config),
            tests = [
                ['foo.jpg', 'test/blog/foo'],
                ['./foo/bar.png', 'test/blog/bar'],
                ['http://www.example.com/image.tiff', 'test/blog/image']
            ];

        for (const [input, expected] of tests) {
            expect(cloudinaryAdapter.toCloudinaryId(input)).to.equals(expected);
        }
        done();
    });
});
