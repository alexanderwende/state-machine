var System = require('systemjs');
var assert = require('chai').assert;

System.config({
    baseURL: 'src/js'
});

describe('Serializer', function () {

    'use strict';

    var Serializer;

    before(function (done) {

        System.import('./serializer')
            .then(function (module) {
                Serializer = module.default;
                done();
            })
            .catch(function (error) {
                throw error;
            });
    });

    describe('#serialize()', function () {

        it('should serialize data to url-encoded string', function (done) {

            var data = {
                user: {
                    name: 'alex',
                    age: 32,
                    address: {
                        street: 'some street',
                        number: 1
                    }
                },
                what: ['first', 'last'],
                asc: true
            };

            var query = encodeURI('user[name]=alex&user[age]=32&user[address][street]=some street&user[address][number]=1&what[]=first&what[]=last&asc=true');

            assert.equal(Serializer.serialize(data, 'urlencoded'), query);

            done();
        });
    });
});
