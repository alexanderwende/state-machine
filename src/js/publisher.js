class Publisher {

    constructor (options) {

        this._eventDelimiter = options && options.delimiter || '.';
        this._eventWildcard = options && options.wildcard || '*';
        this._events = {};
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

            subscribers = subscribers.concat(event[this._eventWildcard].subscribers, event[i].subscribers);
            event = event[i].events;
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

        var keys    = key.split(this._eventDelimiter),
            length  = keys.length,
            event   = this._events,
            subscribers,
            i;

        for (i = 0; i < length; i++) {

            subscribers = event[i].subscribers;
            event = event[i].events;
        }

        subscribers.push(callback);
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
