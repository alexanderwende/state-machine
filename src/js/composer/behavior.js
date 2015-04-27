import EventEmitter from './event-emitter';

class Behavior extends EventEmitter {

    constructor (options) {

        super(options);

        this._behaviors = {};

        this.id = options.id !== undefined ? options.id : this.constructor.getNextId();

        this.host = options.host;


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
