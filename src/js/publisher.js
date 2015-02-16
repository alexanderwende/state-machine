class Publisher {

    constructor (options) {

        this._eventDelimiter = options && options.delimiter || '.';
        this._eventWildcard = options && options.wildcard || '*';
        this._events = {};
    }

    ensure (event, key) {

        if (!event[key]) {

            event[key] = {
                subscribers: [],
                events: {}
            }
        }

        return event[key];
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

        var keys    = key.split(this._eventDelimiter),
            length  = keys.length,
            event   = this._events,
            subscribers,
            i;

        for (i = 0; i < length; i++) {

            if (!event[keys[i]]) {
                event[keys[i]] = {
                    subscribers: [],
                    events: {}
                };
            }

            subscribers = this.ensure(event, keys[i]).subscribers;
            event = event[keys[i]].events;
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
