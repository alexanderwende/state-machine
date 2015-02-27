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
     * @param   {String}       event    The event name
     * @param   {Function}     listener The event listener
     * @returns {EventEmitter} The EventEmitter instance for chainability
     */
    addListener (event, listener) {

        if (!this._listeners.has(event)) {

            // iterating and modifying arrays is faster than
            // iterating and modifying sets, but checking
            // for duplicate entries is way more costly in arrays
            // and therefore insert loops with checks perform slower
            // with arrays
            this._listeners.set(event, new Set());
        }

        this._listeners.get(event).add(listener);

        return this;
    }

    /**
     * Remove an event listener
     *
     * @param   {String}   event    The event name
     * @param   {Function} listener The event listener
     * @returns {Boolean}  True if the listener was removed
     */
    removeListener (event, listener) {

        if (!this._listeners.has(event)) {

            return false;
        }

        return this._listeners.get(event).delete(listener);
    }

    /**
     * Remove all event listeners
     *
     * @param   {String}  [event] An optional event name
     * @returns {Boolean} True if the listeners were removed
     */
    removeAll (event) {

        if (!event) {

            return this._listeners.clear() || true;
        }

        if (this._listeners.has(event)) {

            return this._listeners.get(event).clear() || true;
        }

        return false;
    }

    /**
     * Emit an event
     *
     * @param {String} event     The event name
     * @param {*}      [...args] Optional arguments to send with the event
     */
    emit (event, ...args) {

        if (this._listeners.has(event)) {

            this._listeners.get(event).forEach(function (listener) {

                listener.call(null, event, ...args);
            });
        }
    }
}

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

export default EventEmitter;
