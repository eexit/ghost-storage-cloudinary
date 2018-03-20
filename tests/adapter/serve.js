'use strict';

const chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    CloudinaryAdapter = require(path.join(__dirname, '../../'));

let cloudinaryAdapter = null;

describe('serve', function () {
    it('should return a function', function (done) {
        let called = false;
        cloudinaryAdapter = new CloudinaryAdapter();
        const handler = cloudinaryAdapter.serve();
        expect(handler).to.be.a('function');
        handler(null, null, function () {
            called = true;
        });
        expect(called).to.equal(true);
        done();
    });
});
