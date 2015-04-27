import EventEmitter from './event-emitter';
import DomService from './services/dom-service';

class Behavior extends EventEmitter {

    constructor (options = {}) {

        super(options);

        this._behaviors = {};

        this._domEvents = [];

        this._hostEvents = [];

        this._globalEvents = [];

        this.id = options.id !== undefined ? options.id : this.constructor.getNextId();

        this.host = options.host;

        this.element = options.host.element;

        this._parseEvents(options);
    }

    _parseEvents (options) {

        var events = options.events;

        for (let i = 0, l = events.length; i < l; i++) {

            let event = events[i];

            let type = event.type;
            let target = event.target;
            let listener = typeof event.listener === 'function' ? event.listener : this[event.listener].bind(this);

            if (typeof target === 'string' || target instanceof EventTarget) {

                this._domEvents.push({
                    type: type,
                    target: target,
                    listener: listener
                });
            }
            else if (target === this.host) {

                this._hostEvents.push({
                    type: type,
                    target: target,
                    listener: listener
                });
            }
            else {

                this._globalEvents.push({
                    type: type,
                    target: target,
                    listener: listener
                });
            }
        }
    }

    _bindGlobalEvents () {}

    _bindHostEvents () {

        for (let i = 0, l = this._hostEvents.length; i < l; i++) {

            let event = this._hostEvents[i];

            this.host.addListener(event.type, event.listener);
        }
    }

    _bindDomEvents () {

        for (let i = 0, l = this._domEvents.length; i < l; i++) {

            let event = this._domEvents[i];

            DomService.select(event.target, this.element).addEventListener(event.type, event.listener);
        }
    }

    /**
     * Add or get a behavior
     * @param   {Object|String} behavior     A behavior instance, behavior options or behavior name
     * @param   {String}        [behaviorId] A behavior id
     * @returns {Behavior}      The requested behavior or itself
     */
    behavior (behavior, behaviorId) {

        switch (typeof behavior) {

            case 'object':

                if (!(behavior instanceof Behavior)) {

                    behavior = new Behavior(behavior);
                }

                behavior.id = behaviorId !== undefined ? behaviorId : behavior.id;

                this._behaviors[behavior.id] = behavior;

                break;

            case 'string':

                return this._behaviors[behavior];
        }

        return this;
    }

    onInit () {}

    onStart () {}

    onRender () {}

    onStop () {}

    onDestroy () {}
}

Behavior._nextId = 0;

Behavior.getNextId = function () {

    return this._nextId++;
}

export default Behavior;
