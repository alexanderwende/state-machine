class Node {

    constructor (options = {}) {

        this.name = options.name;

        this.value = options.value;

        this._parent = options.parent || null;

        this._children = new Map();
    }

    hasParent () {

        return this._parent !== null;
    }

    getParent () {

        return this._parent;
    }

    setParent (parent) {

        this._parent = parent;
    }

    hasChild (child) {

        return this._children.has(child);
    }

    getChild (child) {

        return this._children.get(child);
    }

    setChild (child) {

        child.setParent(this);

        return this._children.set(child.name, child);
    }

    removeChild (child) {

        child.setParent(null);

        return this._children.delete(child.name);
    }

    getChildren () {

        return this._children;
    }

    hasValue () {

        return this.value !== undefined;
    }

    getValue () {

        return this.value;
    }

    setValue (value) {

        this.value = value;
    }
}
