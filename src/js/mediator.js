import {default as Tree, ArrayNode} from './tree';

class Mediator {

    constructor (options) {

        this._delimiter = options && options.delimiter || '.';
        this._wildcard = options && options.wildcard || '*';

        this._subscribers = new Tree({
            delimiter: this._delimiter,
            wildcard: this._wildcard,
            nodeType: ArrayNode
        });
    }

    publish (key, data) {

        var subscribers = this._subscribers.collect(key);

        for (let i = subscribers.length; i-- > 0; subscribers[i](key, data));
    }

    subscribe (key, callback) {

        this._subscribers.set(key, callback);
    }

    unsubscribe (key, callback) {

        return this._subscribers.remove(key, callback);
    }
}

export default Mediator;
