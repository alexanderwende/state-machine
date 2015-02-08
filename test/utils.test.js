var System = require('systemjs');
var assert = require('chai').assert;

System.config({
    baseURL: 'src/js'
});

describe('Utils', function () {

    'use strict';

    var Utils;

    before(function (done) {

        System.import('./utils')
            .then(function (module) {
                Utils = module.default;
                done();
            })
            .catch(function (error) {
                throw error;
            });
    });

    describe('#someMethod()', function () {

        it('should do something', function (done) {

            // assert something

            done();
        });
    });
});
