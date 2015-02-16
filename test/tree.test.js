var System = require('systemjs');
var assert = require('chai').assert;

System.config({
    baseURL: 'src/js'
});

describe('Tree', function () {

    'use strict';

    var Tree;
    var Node;
    var ArrayNode;

    before(function (done) {

        System.import('./tree')
            .then(function (module) {
                Tree = module.default;
                Node = module.Node;
                ArrayNode = module.ArrayNode;
                done();
            })
            .catch(function (error) {
                throw error;
            });
    });

    describe('#set()/#get()', function () {

        it('should insert and retrieve tree nodes correctly', function (done) {

            var tree = new Tree();

            tree.set('a', true);
            tree.set('b', true);
            tree.set('a.b', false);
            tree.set('b.c', true);
            tree.set('b.d', false);

            assert.equal(tree.get('a'), true);
            assert.equal(tree.get('b'), true);
            assert.equal(tree.get('a.b'), false);
            assert.equal(tree.get('b.c'), true);
            assert.equal(tree.get('b.d'), false);

            done();
        });
    });

    describe('#remove()', function () {

        it('should remove tree nodes correctly', function (done) {

            var tree = new Tree();

            tree.set('a', true);
            tree.set('b', true);
            tree.set('a.b', false);
            tree.set('b.c', true);
            tree.set('b.d', false);

            assert.equal(tree.get('b.d'), false);
            assert.equal(tree.remove('b.d'), false);
            assert.equal(tree.get('b.d'), undefined);
            assert.equal(tree.get('b.c'), true);

            assert.equal(tree.get('a'), true);
            assert.equal(tree.get('a.b'), false);
            assert.equal(tree.remove('a'), true);
            assert.equal(tree.get('a'), undefined);
            assert.equal(tree.get('a.b'), undefined);

            assert.equal(tree.remove('a'), undefined);

            done();
        });
    });

    describe('#collect()', function () {

        it('should collect tree nodes correctly', function (done) {

            var tree = new Tree({
                wildcard: '*',
                nodeType: ArrayNode
            });

            tree.set('a', 1);
            tree.set('b', 2);
            tree.set('a.b', 3);
            tree.set('b.c', 4);
            tree.set('b.d', 5);

            assert.deepEqual(tree.collect('a'), [1]);
            assert.deepEqual(tree.collect('b'), [2]);
            assert.deepEqual(tree.collect('a.b'), [3]);
            assert.deepEqual(tree.collect('b.d'), [5]);

            tree.set('*', 10);
            tree.set('a.*', 20);
            tree.set('b.*', 30);

            assert.deepEqual(tree.collect('a'), [10, 1]);
            assert.deepEqual(tree.collect('b'), [10, 2]);
            assert.deepEqual(tree.collect('a.b'), [10, 20, 3]);
            assert.deepEqual(tree.collect('b.d'), [10, 30, 5]);

            tree.set('a.b', 6);
            tree.set('a.b', 9);

            assert.deepEqual(tree.collect('a.b'), [10, 20, 3, 6, 9]);

            assert.deepEqual(tree.remove('*'), [10]);
            assert.deepEqual(tree.remove('a.*'), [20]);

            assert.deepEqual(tree.collect('a.b'), [3, 6, 9]);

            done();
        });
    });
});
