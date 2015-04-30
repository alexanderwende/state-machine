import Event from './event';

/**
 * @class EventEmitter
 */
class EventEmitter {

    /**
     * @constructs EventEmitter
     */
    constructor () {

        // iterating and modifying maps is more performant
        // than iterating or modifying hot objects
        this._listeners = new Map();
    }

    /**
     * Add an event listener
     *
     * @param   {String}       type     The event type/name
     * @param   {Function}     listener The event listener
     * @returns {EventEmitter} The EventEmitter instance for chainability
     */
    addListener (type, listener) {

        if (!this._listeners.has(type)) {

            // iterating and modifying arrays is faster than
            // iterating and modifying sets, but checking
            // for duplicate entries is way more costly in arrays
            // and therefore insert loops with checks perform slower
            // with arrays
            this._listeners.set(type, new Set());
        }

        this._listeners.get(type).add(listener);

        return this;
    }

    /**
     * Remove an event listener
     *
     * @param   {String}   type     The event type/name
     * @param   {Function} listener The event listener
     * @returns {Boolean}  True if the listener was removed
     */
    removeListener (type, listener) {

        if (!this._listeners.has(type)) {

            return false;
        }

        return this._listeners.get(type).delete(listener);
    }

    /**
     * Remove all event listeners
     *
     * @param   {String}  [type]  An optional event type/name
     * @returns {Boolean} True if the listeners were removed
     */
    removeAll (type) {

        if (!type) {

            return this._listeners.clear() || true;
        }

        if (this._listeners.has(type)) {

            return this._listeners.get(type).clear() || true;
        }

        return false;
    }

    /**
     * Emit an event
     *
     * @param {String} type   The event type/name
     * @param {*}      [data] The event data
     */
    emit (type, data) {

        let event = new Event({
            type: type,
            data: data,
            target: this
        });

        if (this._listeners.has(type)) {

            let iterator = this._listeners.get(type).values();
            let listener = iterator.next();

            while (!listener.done && !event.isCancelled) {

                listener.value(event);

                listener = iterator.next();
            }
        }
    }
}

export default EventEmitter;
