'use strict';

const chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    CloudinaryAdapter = require(path.join(__dirname, '../../')),
    fixtures = require(path.join(__dirname, 'fixtures'));

describe('toCloudinaryFile', function () {
    it('returns correct file name (no folder)', function (done) {
        let config = fixtures.sampleConfig(),
            tests = [
                ['foo.jpg', 'foo.jpg'],
                ['./foo/bar.png', 'bar.png'],
                ['http://www.example.com/image.tiff', 'image.tiff']
            ],
            cloudinaryAdapter = null;

        Reflect.deleteProperty(config.upload, 'folder');
        cloudinaryAdapter = new CloudinaryAdapter(config);

        for (const [input, expected] of tests) {
            expect(cloudinaryAdapter.toCloudinaryFile(input)).to.equals(expected);
        }
        done();
    });

    it('returns correct file name (with folder)', function (done) {
        let config = fixtures.sampleConfig();
        config.upload.folder = 'test/blog';

        const cloudinaryAdapter = new CloudinaryAdapter(config),
            tests = [
                ['foo.jpg', 'test/blog/foo.jpg'],
                ['./foo/bar.png', 'test/blog/bar.png'],
                ['http://www.example.com/image.tiff', 'test/blog/image.tiff']
            ];

        for (const [input, expected] of tests) {
            expect(cloudinaryAdapter.toCloudinaryFile(input)).to.equals(expected);
        }
        done();
    });
});
