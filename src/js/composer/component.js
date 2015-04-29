import EventEmitter from './event-emitter';
import Behavior from './behavior';
import dom from './services/dom-service';
import utils from './services/utility-service';

class Component extends EventEmitter {

    constructor (options = {}) {

        super(options);

        this.init(options);
    }

    /**
     * Add or get a component
     *
     * @param   {Object|String} component     A component instance, component options or component id
     * @param   {String}        [componentId] A component id
     * @returns {Component}     The component with the specified id or itself
     */
    component (component, componentId) {

        switch (typeof component) {

            case 'object':

                if (!(component instanceof Component)) {

                    let componentClass = component.componentClass;
                    let componentOptions = (typeof component.componentOptions === 'function') ? component.componentOptions(this) : component.componentOptions;

                    if (componentId !== undefined) {

                        componentOptions.id = componentId;
                    }

                    component = new componentClass(componentOptions);
                }

                this.components[component.id] = component;

                break;

            case 'string':

                return this.components[component];
        }

        return this;
    }

    /**
     * Add or get a behavior
     *
     * @param   {Object|String}      behavior   A behavior instance, behavior options or a behavior id
     * @param   {String}             behaviorId A behavior id
     * @returns {Behavior|Component} The behavior with the specified id or itself
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

                    behaviorOptions.host = this;

                    behavior = new behaviorClass(behaviorOptions);
                }

                this._behaviors[behavior.id] = behavior;

                break;

            case 'string':

                return this._behaviors[behavior];
        }

        return this;
    }

    // lifecycle methods

    init (options) {

        console.log('component.init()...');

        utils.extend(this, options);

        this.options = options;

        this.id = this.id !== undefined ? this.id : this.constructor.getNextId();

        this.element = this.element !== undefined ? dom.select(this.element) : dom.select('body');

        this._behaviors = {};

        this._components = {};

        utils.each(['init', 'start', 'render', 'stop', 'destroy'], function (event) {

            let listener = this['on' + utils.capitalize(event)];

            if (typeof listener === 'function') {

                this.addListener(event, listener.bind(this));
            }

        }, this);

        utils.each(this.behaviors, function (behavior, key) {

            this.behavior(behavior, key);

        }, this);

        utils.each(this.components, function (component, key) {

            this.component(component, key);

        }, this);

        this.emit('init');
    }

    onInit (options) {}

    start (options) {

        this.emit('start');
    }

    onStart () {}

    render (options) {

        this.emit('render');
    }

    onRender () {}

    stop (options) {

        this.emit('stop');
    }

    onStop () {}

    destroy (options) {

        this.emit('destroy');
    }

    onDestroy () {}
}

Component._nextId = 0;

Component.getNextId = function () {

    return this._nextId++;
}

export default Component;
