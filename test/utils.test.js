var System = require('systemjs');
var assert = require('chai').assert;

System.config({
    baseURL: 'src/js'
});

describe('Utils', function () {

    'use strict';

    var clone;
    var extend;
    var Serializer;
    var Parser;

    before(function (done) {

        System.import('./utils')
            .then(function (module) {
                clone = module.clone;
                extend = module.extend;
                Serializer = module.Serializer;
                Parser = module.Parser;
                done();
            })
            .catch(function (error) {
                throw error;
            });
    });

    describe('#clone()', function () {

        it('should clone an object', function (done) {

            var a = [1, 2, [3, 4]];
            var o = {a: 1, b: '2', c: {foo: 'bar'}};
            var r = /^foo.*bar$/gi;

            assert.strictEqual(clone(undefined), undefined);
            assert.strictEqual(clone(null), null);
            assert.strictEqual(clone(1), 1);
            assert.strictEqual(clone('text'), 'text');
            assert.strictEqual(clone(true), true);

            assert.notEqual(clone(a), a);
            assert.deepEqual(clone(a), a);
            assert.equal(clone(a)[2], a[2]);
            assert.deepEqual(clone(a, true), a);
            assert.notEqual(clone(a, true)[2], a[2]);

            assert.notEqual(clone(o), o);
            assert.deepEqual(clone(o), o);
            assert.equal(clone(o).c, o.c);
            assert.deepEqual(clone(o, true), o);
            assert.notEqual(clone(o, true).c, o.c);

            assert.notEqual(clone(r), r);
            assert.deepEqual(clone(r), r);

            done();
        });
    });

    describe('#extend()', function () {

        it('should extend an object', function (done) {

            var a = {c: {bar: 'foo'}};
            var b = {a: 1, b: '2', c: {foo: 'bar'}};

            assert.equal(extend(a, b), a);

            a = {c: {bar: 'foo'}};
            b = {a: 1, b: '2', c: {foo: 'bar'}};

            assert.notEqual(extend(a, b), b);

            a = {c: {bar: 'foo'}};
            b = {a: 1, b: '2', c: {foo: 'bar'}};

            assert.deepEqual(extend(a, b), b);

            a = {c: {bar: 'foo'}};
            b = {a: 1, b: '2', c: {foo: 'bar'}};

            assert.equal(extend(a, b).c, b.c);

            a = {c: {bar: 'foo'}};
            b = {a: 1, b: '2', c: {foo: 'bar'}};

            assert.deepEqual(extend(a, b, true), {a: 1, b: '2', c: {bar: 'foo', foo: 'bar'}});

            a = {c: {bar: 'foo'}};
            b = {a: 1, b: '2', c: {foo: 'bar'}};

            assert.notEqual(extend(a, b, true).c, b.c);

            a = [1, 2, [3, 4]];
            b = [5, 6, [7, 8]];

            assert.equal(extend(a, b), a);

            a = [1, 2, [3, 4]];
            b = [5, 6, [7, 8]];

            assert.notEqual(extend(a, b), b);

            a = [1, 2, [3, 4]];
            b = [5, 6, [7, 8]];

            assert.deepEqual(extend(a, b), b);

            a = [1, 2, [3, 4]];
            b = [5, 6, [7, 8]];

            assert.equal(extend(a, b)[2], b[2]);

            a = [1, 2, [3, 4]];
            b = [5, 6, [7, 8]];

            assert.deepEqual(extend(a, b, true), b);

            a = [1, 2, [3, 4]];
            b = [5, 6, [7, 8]];

            assert.notEqual(extend(a, b, true)[2], b[2]);

            done();
        });
    });

    describe('#Serialzer', function () {

        it('should serialize data', function (done) {

            var data = {
                user: {
                    name: 'alex',
                    age: 32
                },
                what: ['first', 'last'],
                asc: true
            };

            var query = encodeURI('user[name]=alex&user[age]=32&what=first&what=last&asc=true');

            assert.equal(Serializer.serialize(data, 'urlencoded'), query);

            done();
        });
    });
});
