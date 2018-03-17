'use strict';

var CloudinaryAdapter = require('../index'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    cloudinary = require('cloudinary').v2,
    path = require('path'),
    fixtures = require(path.join(__dirname, '/fixtures')),
    cloudinaryAdapter = null;

describe('serve', function () {
    it('should return a function', function (done) {
        cloudinaryAdapter = new CloudinaryAdapter();
        var called = false;

        var handler = cloudinaryAdapter.serve();
        expect(handler).to.be.a('function');
        handler(null, null, function () {
            called = true;
        });
        expect(called).to.equal(true);
        done();
    });
});
