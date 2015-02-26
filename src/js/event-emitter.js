class EventEmitter {

    constructor () {

        this._listeners = new Map();
    }

    addListener (event, listener) {

        if (!this._listeners.has(event)) {

            this._listeners.set(event, new Set());
        }

        this._listeners.get(event).add(listener);

        return this;
    }

    removeListener (event, listener) {

        if (!this._listeners.has(event)) {

            return false;
        }

        return this._listeners.get(event).delete(listener);
    }

    emit (event, args) {

        var listeners = this._listeners.get(event);

        if (listeners) {

            // TODO: Fix this, re-scoping does not work!
            let listeners = listeners.values(),
                length = listeners.length,
                i = 0;

            for (i; i < length; i++) {

                listeners[i](args);
            }
        }
    }
}

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

export default EventEmitter;
