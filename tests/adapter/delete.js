'use strict';

const chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    cloudinary = require('cloudinary').v2,
    path = require('path'),
    CloudinaryAdapter = require(path.join(__dirname, '../../')),
    common = require(path.join(__dirname, '../../errors')),
    fixtures = require(path.join(__dirname, 'fixtures'));

let cloudinaryAdapter = null;

describe('delete', function () {
    before(function () {
        cloudinaryAdapter = new CloudinaryAdapter(fixtures.sampleConfig());
        sinon.stub(cloudinary.uploader, 'destroy');
    });

    it('should delete image successfully', function (done) {
        cloudinary.uploader.destroy.callsArgWith(1, null, {response: "whatever the api returns as a response"});
        cloudinaryAdapter.delete(fixtures.mockImage.name).then(function (res) {
            expect(res).to.deep.equal({response: "whatever the api returns as a response"});
            done();
        });
    });

    it('returns an error when delete image fails', function (done) {
        cloudinary.uploader.destroy.callsArgWith(1, {error: "error"});
        cloudinaryAdapter.delete(fixtures.mockInexistentImage.name)
            .then(function () {
                done('expected error');
            })
            .catch(function (ex) {
                expect(ex).to.be.an.instanceOf(common.errors.GhostError);
                expect(ex.message).to.equal(`Could not delete image ${fixtures.mockInexistentImage.name}`);
                done();
            });
    });
});
