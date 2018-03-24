'use strict';

const chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    RetinaJS = require(path.join(__dirname, '../../../plugins')).RetinaJS,
    emptyFunc = function () {
        // Do nothing
    };

describe('resolveMaxDpr', function () {
    it('should return 1 when image width = baseWidth', function (done) {
        const rjs = new RetinaJS(emptyFunc, {upload: {public_id: 'foo'}}, {baseWidth: 500}),
            image = path.join(__dirname, '500x250.png');

        expect(rjs.resolveMaxDpr(image)).to.equal(1);
        done();
    });

    it('should return 1 when image width < baseWidth', function (done) {
        const rjs = new RetinaJS(emptyFunc, {upload: {public_id: 'foo'}}, {baseWidth: 600}),
            image = path.join(__dirname, '500x250.png');

        expect(rjs.resolveMaxDpr(image)).to.equal(1);
        done();
    });

    it('should return 2 when image width = 2 * baseWidth', function (done) {
        const rjs = new RetinaJS(emptyFunc, {upload: {public_id: 'foo'}}, {baseWidth: 250}),
            image = path.join(__dirname, '500x250.png');

        expect(rjs.resolveMaxDpr(image)).to.equal(2);
        done();
    });

    it('should return 2 when image width = 2.5 * baseWidth', function (done) {
        const rjs = new RetinaJS(emptyFunc, {upload: {public_id: 'foo'}}, {baseWidth: 200}),
            image = path.join(__dirname, '500x250.png');

        expect(rjs.resolveMaxDpr(image)).to.equal(2);
        done();
    });

    it('should return 5 when image width = 5 * baseWidth', function (done) {
        const rjs = new RetinaJS(emptyFunc, {upload: {public_id: 'foo'}}, {baseWidth: 100}),
            image = path.join(__dirname, '500x250.png');

        expect(rjs.resolveMaxDpr(image)).to.equal(5);
        done();
    });

    it('should return 5 when image width = 10 * baseWidth', function (done) {
        const rjs = new RetinaJS(emptyFunc, {upload: {public_id: 'foo'}}, {baseWidth: 50}),
            image = path.join(__dirname, '500x250.png');

        expect(rjs.resolveMaxDpr(image)).to.equal(5);
        done();
    });

    it('should throw an error if image is not found', function (done) {
        const rjs = new RetinaJS(emptyFunc, {upload: {public_id: 'foo'}}, {baseWidth: 50});

        try {
            rjs.resolveMaxDpr('./ghost.png');
            done('should raise an error');
        } catch (e) {
            done();
        }
    });
});
