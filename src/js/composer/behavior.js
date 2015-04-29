import EventEmitter from './event-emitter';
import DomService from './services/dom-service';

class Behavior {

    constructor (options = {}) {

        super(options);

        this.init(options);
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
     *
     * @param   {Object|String} behavior   A behavior instance, behavior options or a behavior id
     * @param   {String}        behaviorId A behavior id
     * @returns {Behavior}      The behavior with the specified id or itself
     */
    behavior (behavior, behaviorId) {

        switch (typeof behavior) {

            case 'object':

                if (!(behavior instanceof Behavior)) {

                    let behaviorClass = behavior.behaviorClass || Behavior;
                    let behaviorOptions = ((typeof behavior.behaviorOptions === 'function') ? behavior.behaviorOptions(this) : behavior.behaviorOptions) || {};

                    if (behaviorId !== undefined) {

                        behaviorOptions.id = behaviorId;
                    }

                    behaviorOptions.host = this.host;

                    behavior = new behaviorClass(behaviorOptions);
                }

                this._behaviors[behavior.id] = behavior;

                break;

            case 'string':

                return this._behaviors[behavior];
        }

        return this;
    }

    init (options) {

        console.log('behavior.init()...');

        this.options = utils.extend({}, this.constructor.defaultOptions, options);

        utils.extend(this, this.options);

        this.id = this.id !== undefined ? this.id : this.constructor.getNextId();

        this._behaviors = {};

        utils.each(['init', 'start', 'render', 'stop', 'destroy'], function (event) {

            let listener = this['on' + utils.capitalize(event)];

            if (typeof listener === 'function') {

                this.host.addListener(event, listener.bind(this));
            }

        }, this);

        utils.each(this.behaviors, function (behavior, key) {

            this.behavior(behavior, key);

        }, this);
    }

    onInit () {

        console.log('behavior.onInit()...');
    }

    onStart () {

        console.log('behavior.onStart()...');
    }

    onRender () {

        console.log('behavior.onStart()...');
    }

    onStop () {

        console.log('behavior.onStop()...');
    }

    onDestroy () {

        console.log('behavior.onDestroy()...');
    }
}

Behavior._nextId = 0;

Behavior.getNextId = function () {

    return this._nextId++;
}

Behavior.defaultOptions = {};

export default Behavior;
