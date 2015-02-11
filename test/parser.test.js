var System = require('systemjs');
var assert = require('chai').assert;

System.config({
    baseURL: 'src/js'
});

describe('Parser', function () {

    'use strict';

    var Parser;

    before(function (done) {

        System.import('./parser')
            .then(function (module) {
                Parser = module.default;
                done();
            })
            .catch(function (error) {
                throw error;
            });
    });

    describe('#parse()', function () {

        it('should parse url-encoded strings', function (done) {

            var query = encodeURI('user[name]=alex&user[age]=32&user[address][street]=some street&user[address][number]=1&what[]=first&what[]=last&asc=true');

            var data = {
                user: {
                    name: 'alex',
                    age: '32',
                    address: {
                        street: 'some street',
                        number: '1'
                    }
                },
                what: ['first', 'last'],
                asc: 'true'
            };

            assert.deepEqual(Parser.parse(query, 'urlencoded'), data);

            done();
        });
    });
});
