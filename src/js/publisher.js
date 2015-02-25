class Publisher {

    constructor (options) {

        this._delimiter = options && options.delimiter || '.';
        this._wildcard = options && options.wildcard || '*';
        this._channels = {};
    }

    _ensureChannel (key, parent) {

        return parent[key] ? parent[key] : this._createChannel(key, parent);
    }

    _createChannel (key, parent) {

        parent[key] = {
            subscribers: [],
            channels: {},
            parent: parent
        };

        return parent[key];
    }

    _removeChannel (key, parent) {

        if (parent[key]) {

            parent[key].parent = undefined;

            delete parent[key];
        }
    }

    /**
     * Publish an event
     *
     * @param {string} key
     * @param {*} [data]
     */
    publish (key, data) {

        var keys        = key.split(this._eventDelimiter),
            length      = keys.length,
            event       = this._events,
            subscribers = [],
            i;

        for (i = 0; i < length; i++) {

            subscribers = subscribers.concat(this.ensure(event, this._eventWildcard).subscribers, this.ensure(event, key[i]).subscribers);
            event = event[key[i]].events;
        }

        for (i = subscribers.length; i-- > 0; subscribers[i](key, data));
    }

    /**
     * Subscribe to an event
     *
     * @param {string} key
     * @param {function} callback
     */
    subscribe (key, callback) {

        var keys    = key.split(this._delimiter),
            length  = keys.length,
            channel = this._channels,
            i;

        for (i = 0; i < length; i++) {

            channel = this._ensureChannel(keys[i], channel);
        }

        channel.subscribers.push(callback);
    }

    /**
     * Unsubscribe from an event
     *
     * @param {string} key
     * @param {function} callback
     */
    unsubscribe (key, callback) {

        var keys    = key.split(this._eventDelimiter),
            length  = keys.length,
            event   = this._events,
            subscribers,
            i;

        for (i = 0; i < length; i++) {

            subscribers = event[i].subscribers;
            event = event[i].events;
        }

        i = subscribers.indexOf(callback);

        if (i >= 0) {

            subscribers.splice(i, 1);
        }
    }
}

//var events = {
//    '*': {
//        subscribers: [],
//        events: {}
//    },
//    'sub': {
//        subscribers: [],
//        events: {
//            '*': {
//                subscribers: [],
//                events: {}
//            }
//        }
//    }
//};

export default Publisher;
