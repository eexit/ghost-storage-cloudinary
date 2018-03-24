'use strict';

require('bluebird');

const chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    path = require('path'),
    fixtures = require(path.join(__dirname, 'fixtures')),
    Adapter = require(path.join(__dirname, '../../../')),
    RetinaJS = require(path.join(__dirname, '../../../plugins')).RetinaJS,
    adapter = new Adapter();

let uploader = null;

describe('retinize', function () {
    beforeEach(function () {
        uploader = sinon.stub(adapter, 'uploader');
    });

    it('should retinize successfully (dpr1)', function (done) {
        const image = fixtures.mockImage,
            config = {upload: {public_id: image.name}},
            rjs = new RetinaJS(uploader, config, {baseWidth: 500});

        uploader.withArgs(image.path, sinon.match(config), true).resolves('http://example.com/500x250.png');

        rjs.retinize(image).then(function (url) {
            expect(url).to.equal('http://example.com/500x250.png');
            expect(uploader.callCount).to.equal(1, 'Uploader should have been called 1 time');
            done();
        }).
            catch(function (err) {
                done(err);
            });
    });

    it('should return an error when an error occurs (dpr1)', function (done) {
        const image = fixtures.mockImage,
            config = {upload: {public_id: image.name}},
            rjs = new RetinaJS(uploader, config, {baseWidth: 500});

        uploader.withArgs(image.path, sinon.match(config), true).rejects(new Error('some error occurred'));

        rjs.retinize(image).then(function () {
            done('should raise an error');
        }).
            catch(function (err) {
                expect(err.message).to.equal('some error occurred');
                expect(uploader.callCount).to.equal(1, 'Uploader should have been called 1 time');
                done();
            });
    });

    it('should retinize successfully (dpr4/sync)', function (done) {
        const image = fixtures.mockImage,
            config = {upload: {public_id: `${image.name}@4x`}},
            rjs = new RetinaJS(uploader, {upload: {public_id: image.name}}, {baseWidth: 125});

        uploader.withArgs(image.path, sinon.match(config), true).resolves('http://example.com/500x250.png');
        uploader.withArgs('http://example.com/500x250.png', sinon.match.object, false).resolves();

        rjs.retinize(image).then(function (url) {
            expect(url).to.equal('http://example.com/500x250.png');
            expect(uploader.callCount).to.equal(4, 'Uploader should have been called 4 times');
            done();
        }).
            catch(function (err) {
                done(err);
            });
    });

    it('should return an error when an error occurs (dpr4/sync)', function (done) {
        const image = fixtures.mockImage,
            config3 = {upload: {public_id: `${image.name}@3x`}},
            config4 = {upload: {public_id: `${image.name}@4x`}},
            rjs = new RetinaJS(uploader, {upload: {public_id: image.name}}, {baseWidth: 125});

        uploader.withArgs(image.path, sinon.match(config4), true).resolves('http://example.com/500x250.png');
        uploader.withArgs('http://example.com/500x250.png', sinon.match(config3), false).rejects(new Error('Oops!'));

        rjs.retinize(image).then(function () {
            done('should raise an error');
        }).
            catch(function (err) {
                expect(err.message).to.equal('Oops!');
                expect(uploader.callCount).to.equal(4, 'Uploader should have been called 4 times');
                done();
            });
    });

    it('should retinize successfully (dpr4/async)', function (done) {
        const image = fixtures.mockImage,
            config = {upload: {public_id: `${image.name}@4x`}},
            rjs = new RetinaJS(uploader, {upload: {public_id: image.name}}, {
                baseWidth: 125,
                fireForget: true
            });

        uploader.withArgs(image.path, sinon.match(config), true).resolves('http://example.com/500x250.png');
        uploader.withArgs('http://example.com/500x250.png', sinon.match.object, false).resolves();

        rjs.retinize(image).then(function (url) {
            expect(url).to.equal('http://example.com/500x250.png');
            expect(uploader.callCount).to.equal(4, 'Uploader should have been called 4 times');
            done();
        }).
            catch(function (err) {
                done(err);
            });
    });

    it('should return an error when a retinize errors at first dpr (dpr4/async)', function (done) {
        const image = fixtures.mockImage,
            config3 = {upload: {public_id: `${image.name}@3x`}},
            config4 = {upload: {public_id: `${image.name}@4x`}},
            rjs = new RetinaJS(uploader, {upload: {public_id: image.name}}, {
                baseWidth: 125,
                fireForget: true
            });

        uploader.withArgs(image.path, sinon.match(config4), true).rejects(new Error('Oops!'));
        uploader.withArgs('http://example.com/500x250.png', sinon.match(config3), false).resolves();

        rjs.retinize(image).then(function () {
            done('should raise an error');
        }).
            catch(function (err) {
                expect(err.message).to.equal('Oops!');
                expect(uploader.callCount).to.equal(1, 'Uploader should have been called 1 time');
                done();
            });
    });

    it('should not return an error when a retinize error occurs after the first dpr (dpr4/async)', function (done) {
        const image = fixtures.mockImage,
            config3 = {upload: {public_id: `${image.name}@3x`}},
            config4 = {upload: {public_id: `${image.name}@4x`}},
            rjs = new RetinaJS(uploader, {upload: {public_id: image.name}}, {
                baseWidth: 125,
                fireForget: true
            });

        uploader.withArgs(image.path, sinon.match(config4), true).resolves('http://example.com/500x250.png');
        uploader.withArgs('http://example.com/500x250.png', sinon.match(config3), false).rejects('Oops!');

        rjs.retinize(image).then(function (url) {
            expect(url).to.equal('http://example.com/500x250.png');
            expect(uploader.callCount).to.equal(4, 'Uploader should have been called 4 times');
            done();
        }).
            catch(function (err) {
                done(err);
            });
    });

    afterEach(function () {
        adapter.uploader.restore();
    });
});
