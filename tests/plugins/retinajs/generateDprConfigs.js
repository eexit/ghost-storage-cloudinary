'use strict';

const chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    RetinaJS = require(path.join(__dirname, '../../../plugins')).RetinaJS,
    emptyFunc = function () {
        // Do nothing
    };

describe('generateDprConfigs', function () {
    it('should return 1 config when dpr = 1 and have public_id untouched', function (done) {
        const rjs = new RetinaJS(emptyFunc, {public_id: 'foo'}, {baseWidth: 200}),
            dprConfig = rjs.generateDprConfigs(1);

        expect(dprConfig).to.have.lengthOf(1);
        expect(dprConfig[0].public_id).to.equal('foo');
        expect(dprConfig[0].width).to.equal(200);
        expect(dprConfig[0].crop).to.equal('scale');
        expect(dprConfig[0].dpr).to.equal('1.0');
        expect(dprConfig[0].tags[0]).to.equal('dpr1');
        done();
    });

    it('should return 3 configs when dpr = 3', function (done) {
        const uploadConfig = {
                public_id: 'foo',
                tags: ['test']
            },
            rjs = new RetinaJS(emptyFunc, uploadConfig, {baseWidth: 200}),
            dprConfig = rjs.generateDprConfigs(3);

        expect(dprConfig).to.have.lengthOf(3);

        for (let i = 0; i < 3; i += 1) {
            let pubId = 'foo';

            if (i <= 1) {
                pubId = `foo@${3 - i}x`;
            }

            expect(dprConfig[i].public_id).to.equal(pubId);
            expect(dprConfig[i].width).to.equal(200);
            expect(dprConfig[i].crop).to.equal('scale');
            expect(dprConfig[i].dpr).to.equal(`${3 - i}.0`);
            expect(dprConfig[i].tags[1]).to.equal(`dpr${3 - i}`);
        }
        done();
    });

    it('should throw an error when dpr < 1', function (done) {
        const rjs = new RetinaJS(emptyFunc, {public_id: 'foo'}, {baseWidth: 1});
        try {
            rjs.generateDprConfigs(0);
            done('should raise an error');
        } catch (e) {
            expect(e.message).to.equal('Unexpected dpr value: 0');
            done();
        }
    });
});
