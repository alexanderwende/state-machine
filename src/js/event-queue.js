class EventQueue {

    constructor (options) {

        this._head = null;
        this._tail = null;

        this._subscribers = new Map();
    }

    raise (event) {

        var item = {
            name: event.name,
            event: event,
            _next: null
        };

        if (this._tail) {
            this._tail._next = event;
        }
        else {
            this._head = event;
        }

        this._tail = event;
    }

    next () {

        var item = this._head;

        this._head = this._head._next;

        if (!this._head) {
            this._tail = this._head;
        }

        return item.event;
    }

    subscribe (subscriber, event) {

        var subscribers = this._subscribers.get(event);

        if (subscribers) {
            subscribers.add(subscriber);
        }
        else {
            subscribers = new Set();
            subscribers.add(subscriber);
            this._subscribers.set(event, subscribers);
        }

        return this;
    }

    unsubscribe (subscriber, event) {

        var subscribers = this._subscribers.get(event);

        if (subscribers) {
            return subscribers.delete(subscriber);
        }

        return false;
    }

    dispatch () {

        var event;

        while (event = this.next()) {
            // do sth with the event
            let subscribers = this._subscribers.get(event);

            if (subscribers) {

                subscribers.forEach(function (subscriber) {
                    subscriber(event);
                });
            }
        }
    }
}

export default EventQueue;
