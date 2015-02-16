class Tree {

    /**
     * @constructor
     *
     * @param {object} [options]
     * @param {string} [options.delimiter]
     * @param {string} [options.wildcard]
     * @param {function} [options.nodeType]
     */
    constructor (options) {

        /** @type {string} */
        this._delimiter = options && options.delimiter || '.';

        /** @type {string} */
        this._wildcard = options && options.wildcard || '*';

        /** @type {function} */
        this._nodeType = options && options.nodeType || Node;

        /** @type {Node} */
        this.root = new this._nodeType();
    }

    /**
     * @param {string} key
     * @returns {*}
     */
    get (key) {

        var keys = key.split(this._delimiter),
            node = this.root;

        for (let i = 0, length = keys.length; i < length; i++) {

            node = node.getChild(keys[i]);

            if (!node) {

                return undefined;
            }
        }

        return node.getValue();
    }

    /**
     * @param {string} key
     * @returns {Array}
     */
    collect (key) {

        var keys = key.split(this._delimiter),
            node = this.root,
            value = undefined,
            values = [];

        for (let i = 0, length = keys.length; i < length; i++) {

            if (node.hasChild(this._wildcard)) {

                value = node.getChild(this._wildcard).getValue();

                if (value !== undefined) {

                    values = values.concat(value);
                }
            }

            node = node.getChild(keys[i]);

            if (!node) {

                break;
            }
        }

        if (node) {

            value = node.getValue();

            if (value !== undefined) {

                values = values.concat(value);
            }
        }

        return values;
    }

    /**
     * @param {string} key
     * @param {*} value
     */
    set (key, value) {

        var keys = key.split(this._delimiter),
            node = this.root;

        for (let i = 0, length = keys.length; i < length; i++) {

            if (!node.hasChild(keys[i])) {

                node.setChild(keys[i], new this._nodeType(keys[i]));
            }

            node = node.getChild(keys[i]);
        }

        node.setValue(value);
    }

    /**
     * @param {string} key
     * @param {*} [value]
     * @returns {*}
     */
    remove (key, value) {

        var keys = key.split(this._delimiter),
            node = this.root;

        for (let i = 0, length = keys.length; i < length; i++) {

            node = node.getChild(keys[i]);

            if (!node) {

                return undefined;
            }
        }

        if (value !== undefined) {

            return node.removeValue(value);
        }
        else {

            node.getParent().removeChild(node.key);
        }

        return node.removeValue();
    }
}

class Node {

    /**
     * @constructor
     *
     * @param {string} key
     * @param {*} value
     * @param {Node} [parent]
     */
    constructor (key, value, parent) {

        this.key = key;
        this.value = undefined;
        this._parent = undefined;
        this._children = {};

        this.setValue(value);
        this.setParent(parent);
    }

    getValue () {

        return this.value;
    }

    setValue (value) {

        if (value === undefined) {

            this.removeValue();
        }
        else {

            this.value = value;
        }
    }

    removeValue () {

        var value = this.value;

        this.value = undefined;

        return value;
    }

    /**
     * @returns {boolean}
     */
    hasParent () {

        return this._parent !== undefined;
    }

    /**
     * @returns {(Node|undefined)}
     */
    getParent () {

        return this._parent;
    }

    /**
     * @param {Node} node
     */
    setParent (node) {

        this._parent = node;
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    hasChild (key) {

        return this._children.hasOwnProperty(key);
    }

    /**
     * @param {string} key
     * @returns {(Node|undefined)}
     */
    getChild (key) {

        return this._children[key];
    }

    /**
     * @param {string} key
     * @param {Node} node
     */
    setChild (key, node) {

        this._children[key] = node;

        node.setParent(this);
    }

    /**
     * @param {string} key
     * @returns {(Node|undefined)}
     */
    removeChild (key) {

        var node = this._children[key];

        if (node) {

            node._parent = undefined;

            delete this._children[key];
        }

        return node;
    }
}

class ArrayNode extends Node {

    /**
     * @constructor
     *
     * @param {string} key
     * @param {*} value
     * @param {Node} [parent]
     */
    constructor (key, value, parent) {

        super(key, value, parent);
    }

    setValue (value) {

        if (value === undefined) {

            this.removeValue();
        }
        else if (!this.value) {

            this.value = [value];
        }
        else {

            this.value.push(value);
        }
    }

    removeValue (value) {

        if (value !== undefined) {

            let index = this.value.indexOf(value);

            if (index > -1) {

                return this.value.splice(index, 1);
            }
            else {

                value = undefined;
            }
        }
        else {

            value = this.value;

            this.value = [];
        }

        return value;
    }
}

export default Tree;

export {Node, ArrayNode};
