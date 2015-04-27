import EventEmitter from './event-emitter';

class Component extends EventEmitter {

    constructor (options = {}) {

        super(options);

        this._components = {};

        this._behaviors = {};

        this._events = ['init', 'start', 'render', 'stop', 'destroy'];

        this.id = options.id !== undefined ? options.id : this.constructor.getNextId();

        this.element = options.element;

        this.init(options);
    }

    /**
     * Add or get a component
     *
     * @param   {Object|String} component     A component instance, component options or component name
     * @param   {String}        [componentId] A component id
     * @returns {Component}     The component with the specified id or itself
     */
    component (component, componentId) {

        switch (typeof component) {

            case 'object':

                if (!(component instanceof Component)) {

                    component = new Component(component);
                }

                component.id = componentId !== undefined ? componentId : component.id;

                this._components[component.id] = component;

                break;

            case 'string':

                return this._components[component];
        }

        return this;
    }

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

    // lifecycle methods
    init (options, done) {

        if (typeof done === 'function') {

            done(this.emit.bind(this, 'init', options));
        }
        else {

            this.emit('init', options);
        }
    }

    onInit (options, done) {


    }

    start () {}

    onStart () {}

    render () {}

    onRender () {}

    stop () {}

    onStop () {}

    destroy () {}

    onDestroy () {}
}

Component._nextId = 0;

Component.getNextId = function () {

    return this._nextId++;
}

export default Component;
