'use strict';

var CloudinaryAdapter = require('../index'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    cloudinary = require('cloudinary').v2,
    path = require('path'),
    fixtures = require(path.join(__dirname, '/fixtures')),
    cloudinaryAdapter = null;

describe('exists', function () {
    before(function () {
        cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig());
        sinon.stub(cloudinary.uploader, 'explicit');
    });

    it('returns true when image exists', function (done) {
        cloudinary.uploader.explicit.callsArgWith(2, undefined, fixtures.sampleApiResult());

        cloudinaryAdapter.exists(fixtures.mockImage.name).then(function (exists) {
            expect(exists).to.equals(true);
            done();
        });
    });

    it('returns false when image does not exist', function (done) {
        cloudinary.uploader.explicit.callsArgWith(2, {error: "error"}, undefined);

        cloudinaryAdapter.exists(fixtures.mockInexistentImage.name).then(function (exists) {
            expect(exists).to.equals(false);
            done();
        });
    });
});
