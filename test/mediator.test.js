var System = require('systemjs');
var assert = require('chai').assert;

System.config({
    baseURL: 'src/js'
});

describe('Mediator', function () {

    'use strict';

    var Mediator;

    before(function (done) {

        System.import('./mediator')
            .then(function (module) {
                Mediator = module.default;
                done();
            })
            .catch(function (error) {
                throw error;
            });
    });

    describe('#subscribe()/#publish()', function () {

        it('should subscribe and publish', function (done) {

            var count = 0;

            function handler (event, data) {

                assert.equal(event, 'a.b');
                assert.equal(data, 5);

                count++;
            }

            var mediator = new Mediator();

            mediator.subscribe('*', handler);
            mediator.subscribe('a.*', handler);
            mediator.subscribe('b.*', handler);
            mediator.subscribe('a.b', handler);

            mediator.publish('a.b', 5);

            assert.equal(count, 3);

            done();
        });
    });

    describe('#unsubscribe()', function () {

        it('should unsubscribe', function (done) {

            var count = 0;

            function handler (event, data) {

                assert.equal(event, 'a.b');
                assert.equal(data, 5);

                count++;
            }

            var mediator = new Mediator();

            mediator.subscribe('*', handler);
            mediator.subscribe('a.*', handler);
            mediator.subscribe('a.b', handler);
            mediator.subscribe('a.b', handler);
            mediator.subscribe('a.b', handler);

            mediator.publish('a.b', 5);

            assert.equal(count, 5);

            count = 0;

            assert.deepEqual(mediator.unsubscribe('*'), [handler]);
            assert.deepEqual(mediator.unsubscribe('a.b', handler), [handler]);
            assert.deepEqual(mediator.unsubscribe('a.b'), [handler, handler]);

            mediator.publish('a.b', 5);

            assert.equal(count, 1);

            done();
        });
    });
});
