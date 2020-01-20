'use strict';
/* eslint no-new: 0 */

const chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    RetinaJS = require(path.join(__dirname, '../../../plugins')).RetinaJS,
    emptyFunc = function () {
        // Do nothing
    };

describe('constructor', function () {
    it('should fail if uploader is not callable', function (done) {
        try {
            new RetinaJS(null, {}, {baseWidth: 1});
            done('should raise an error');
        } catch (e) {
            expect(e).to.be.instanceOf(TypeError);
            expect(e.message).to.equal('RetinaJS: uploader must be callable');
            done();
        }
    });

    it('should fail with empty uploaderOptions', function (done) {
        try {
            new RetinaJS(emptyFunc, {}, {baseWidth: 100});
            done('should raise an error');
        } catch (e) {
            expect(e).to.be.instanceOf(TypeError);
            expect(e.message).to.equal('RetinaJS error: invalid uploaderOptions.upload.public_id. Ensure to enable Cloudinary upload.use_filename option.');
            done();
        }
    });

    it('should fail with empty public_id uploaderOptions.upload', function (done) {
        try {
            new RetinaJS(emptyFunc, {upload: {public_id: ''}}, {baseWidth: 100});
            done('should raise an error');
        } catch (e) {
            expect(e).to.be.instanceOf(TypeError);
            expect(e.message).to.equal('RetinaJS error: invalid uploaderOptions.upload.public_id. Ensure to enable Cloudinary upload.use_filename option.');
            done();
        }
    });

    it('should fail with invalid rjs.baseWidth option', function (done) {
        try {
            new RetinaJS(emptyFunc, {upload: {public_id: 'foo'}}, {});
            done('should raise an error');
        } catch (e) {
            expect(e).to.be.instanceOf(TypeError);
            expect(e.message).to.equal('RetinaJS config error: invalid rjs.baseWidth option');
            done();
        }
    });

    it('should fail with non-integer rjs.baseWidth value', function (done) {
        try {
            new RetinaJS(emptyFunc, {upload: {public_id: 'foo'}}, {baseWidth: 'string'});
            done('should raise an error');
        } catch (e) {
            expect(e).to.be.instanceOf(TypeError);
            expect(e.message).to.equal('RetinaJS config error: invalid rjs.baseWidth option');
            done();
        }
    });

    it('should fail with rjs.baseWidth value < 1', function (done) {
        try {
            new RetinaJS(emptyFunc, {upload: {public_id: 'foo'}}, {baseWidth: -12});
            done('should raise an error');
        } catch (e) {
            expect(e).to.be.instanceOf(RangeError);
            expect(e.message).to.equal('RetinaJS config error: rjs.baseWidth must be >= 1');
            done();
        }
    });
});
