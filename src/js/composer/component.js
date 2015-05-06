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

                this._components[component.id] = component;

                break;

            case 'string':

                return this._components[component];

            default:

                throw new TypeError('component has to be an object or string');
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

            default:

                throw new TypeError('behavior has to be an object or string');
        }

        return this;
    }

    // lifecycle methods

    init (options) {

        console.log('component.init()...');

        this.options = utils.extend(this.constructor.defaultOptions, options);

        utils.extend(this, this.options);

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

        utils.each(this.behaviors, function (behavior) {

            this.behavior(behavior);

        }, this);

        utils.each(this.components, function (component) {

            this.component(component);

        }, this);

        this.emit('init');
    }

    onInit (event) {

        console.log('component.onInit()... %o', event);
    }

    start (options) {

        this.emit('start');
    }

    onStart () {

        console.log('component.onStart()... %o', event);
    }

    render (options) {

        this.emit('render');
    }

    onRender () {

        console.log('component.onRender()... %o', event);
    }

    stop (options) {

        this.emit('stop');
    }

    onStop () {

        console.log('component.onStop()... %o', event);
    }

    destroy (options) {

        this.emit('destroy');
    }

    onDestroy () {

        console.log('component.onDestroy()... %o', event);
    }
}

Component._nextId = 0;

Component.getNextId = function () {

    return this._nextId++;
}

Component.defaultOptions = {
    events: ['init', 'start', 'render', 'stop', 'destroy'],
    extend: function (options) { return utils.extend({}, this, options); }
};

export default Component;
