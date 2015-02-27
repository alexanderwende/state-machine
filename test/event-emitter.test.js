var System = require('systemjs');
var assert = require('chai').assert;

System.config({
    baseURL: 'src/js'
});

describe('EventEmitter', function () {

    'use strict';

    var EventEmitter;

    before(function (done) {

        System.import('./event-emitter')
            .then(function (module) {
                EventEmitter = module.default;
                done();
            })
            .catch(function (error) {
                throw error;
            });
    });

    describe('#addListener()', function () {

        it('should add listeners', function (done) {

            var count = 0;

            function handler1 () {
                count++;
            }

            function handler2 () {
                count++;
            }

            var emitter = new EventEmitter();

            emitter.addListener('event1', handler1);
            emitter.addListener('event1', handler2);

            assert.ok(emitter._listeners.has('event1'));
            assert.equal(emitter._listeners.get('event1').size, 2);

            emitter.addListener('event1', handler1);
            emitter.addListener('event1', handler2);

            assert.equal(emitter._listeners.get('event1').size, 2, 'handlers should not be added twice to the same event');

            emitter.emit('event1');

            assert.equal(count, 2);

            done();
        });
    });

    describe('#removeListener()/#removeAll()', function () {

        it('should remove listeners', function (done) {

            var count = 0;

            function handler1 () {
                count++;
            }

            function handler2 () {
                count++;
            }

            var emitter = new EventEmitter();

            emitter.addListener('event1', handler1);
            emitter.addListener('event1', handler2);

            emitter.addListener('event2', handler1);
            emitter.addListener('event2', handler2);

            assert.ok(emitter._listeners.has('event1'));
            assert.ok(emitter._listeners.has('event2'));

            assert.equal(emitter._listeners.get('event1').size, 2);
            assert.equal(emitter._listeners.get('event2').size, 2);

            emitter.removeListener('event1', handler1);

            assert.equal(emitter._listeners.get('event1').size, 1);
            assert.equal(emitter._listeners.get('event2').size, 2);

            emitter.removeAll('event2');

            assert.equal(emitter._listeners.get('event1').size, 1);
            assert.equal(emitter._listeners.get('event2').size, 0);

            emitter.removeListener('event1', handler2);

            assert.equal(emitter._listeners.get('event1').size, 0);
            assert.equal(emitter._listeners.get('event2').size, 0);

            emitter.emit('event1');
            emitter.emit('event2');

            assert.equal(count, 0);

            done();
        });
    });

    describe('#emit()', function () {

        it('should emit events and pass event parameters correctly', function (done) {

            var count1 = 0;
            var count2 = 0;

            function handler1 (event, a, b) {

                switch (event) {

                    case 'event1':
                        count1 += a + b;
                        break;

                    case 'event2':
                        count2 += a + b;
                        break;
                }
            }

            function handler2 (event, a, b, c) {

                switch (event) {

                    case 'event1':
                        count1 += a + b + c;
                        break;

                    case 'event2':
                        count2 += a + b + c;
                        break;
                }
            }

            var emitter = new EventEmitter();

            emitter.addListener('event1', handler1);
            emitter.addListener('event1', handler2);

            emitter.addListener('event2', handler1);
            emitter.addListener('event2', handler2);

            emitter.emit('event1', 1, 1, 1);
            emitter.emit('event2', 3, 4, 5);

            assert.equal(count1, 5);
            assert.equal(count2, 19);

            done();
        });
    });
});
