/**
 * @class Tree
 */
class Tree {

    /**
     * @constructs Tree
     *
     * @param {Object}   [options]               An object containing options
     * @param {String}   [options.delimiter=.]   The delimiter used for breaking up nested keys
     * @param {String}   [options.wildcard=*]    The wildcard used for specifying all nested keys
     * @param {Function} [options.nodeType=Node] The node constructor to be used for tree nodes
     */
    constructor (options) {

        /** @type {String} */
        this._delimiter = options && options.delimiter || '.';

        /** @type {String} */
        this._wildcard = options && options.wildcard || '*';

        /** @type {Function} */
        this._nodeType = options && options.nodeType || Node;

        /** @type {Node} */
        this.root = new this._nodeType();
    }

    /**
     * Get the node value for a key
     *
     * @param   {String} key The key of the node
     * @returns {*}      The value of the node
     */
    get (key) {

        var keys = key.split(this._delimiter),
            node = this.root;

        for (let i = 0, length = keys.length; i < length; i++) {

            node = node.getChild(keys[i]);

            if (!node) { return undefined; }
        }

        return node.getValue();
    }

    /**
     * Get the node value for a key, including all wildcard values along the way
     *
     * @param   {String} key The key of the node
     * @returns {Array}  An array with all the collected values
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

            if (!node) { break; }
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
     * Set the value of a node
     *
     * @param {String} key   The key of the node
     * @param {*}      value The value for the node
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
     * Remove the value of a node
     *
     * @param   {String} key     The key of the node
     * @param   {*}      [value] The value to be removed or undefined (all values will be removed)
     * @returns {*}      The removed value or undefined if no value was removed
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

/**
 * @class Node
 */
class Node {

    /**
     * @constructs Node
     *
     * @param {String} key
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

    /**
     * Get the value of a node
     *
     * @returns {*} The value stored in the node
     */
    getValue () {

        return this.value;
    }

    /**
     * Set the value of a node
     *
     * @param {*} value The new value of the node
     */
    setValue (value) {

        if (value === undefined) {

            this.removeValue();
        }
        else {

            this.value = value;
        }
    }

    /**
     * Remove the value of a ndoe
     *
     * @returns {*} The removed value of the node
     */
    removeValue () {

        var value = this.value;

        this.value = undefined;

        return value;
    }

    /**
     * Check if the node has a parent node
     *
     * @returns {Boolean}
     */
    hasParent () {

        return this._parent !== undefined;
    }

    /**
     * Get the parent node of a node
     *
     * @returns {(Node|undefined)} The parent node or undefined
     */
    getParent () {

        return this._parent;
    }

    /**
     * Set the parent node of a node
     *
     * @param {Node} node The parent node
     */
    setParent (node) {

        this._parent = node;
    }

    /**
     * Check if the node has a certain child node
     *
     * @param   {String}  key The key of the child node
     * @returns {Boolean}
     */
    hasChild (key) {

        return this._children.hasOwnProperty(key);
    }

    /**
     * Get a child node of a node
     *
     * @param   {String}           key The key of the child node
     * @returns {(Node|undefined)} The child node or undefined
     */
    getChild (key) {

        return this._children[key];
    }

    /**
     * Set a child node
     *
     * @param {String} key  The key of the child node
     * @param {Node}   node The child node
     */
    setChild (key, node) {

        this._children[key] = node;

        node.setParent(this);
    }

    /**
     * Remove a child node from a node
     *
     * @param   {String}           key The key of the child node
     * @returns {(Node|undefined)} The removed child node or undefined
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

/**
 * @class ArrayNode
 * @extends Node
 */
class ArrayNode extends Node {

    /**
     * @constructs ArrayNode
     *
     * @param {String} key
     * @param {*} value
     * @param {Node} [parent]
     */
    constructor (key, value, parent) {

        super(key, value, parent);
    }

    /**
     * Set the value of a node
     *
     * @param {*} value The new value of the node
     */
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

    /**
     * Remove the value of a node
     *
     * @returns {*} The removed value of the node
     */
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
