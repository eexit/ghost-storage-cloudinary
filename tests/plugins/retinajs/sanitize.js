'use strict';

const chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    RetinaJS = require(path.join(__dirname, '../../../plugins')).RetinaJS;

describe('sanitize', function () {
    it('should remove rjs identifier', function (done) {
        const tests = [
                ['input.ext', 'input.ext'],
                ['foo.ext', 'foo@1x.ext'],
                ['encoded.ext', 'encoded%403x.ext'],
                ['foo@2x.ext', 'foo@2x@1x.ext']
            ],
            rjs = new RetinaJS(function(){/* Do nothing */ }, {upload: {public_id: 'foo'}}, {baseWidth: 1});

        for (const [expected, input] of tests) {
            expect(rjs.sanitize(input)).to.equal(expected);
        }
        done();
    });
});
