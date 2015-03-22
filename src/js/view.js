import EventEmitter from './event-emitter';
import Behavior from './behavior';
import dom from './dom';
import * as utils from './utils';
import * as tpl from './tpl';

export default class View extends EventEmitter {

    constructor (options = {}) {

        this.options = options;

        super();

        this.element = options.element || null;

        this.template = options.template || this.template;

        this.scope = utils.extend({}, options.scope);

        this.html = '';

        this.isRendered = false;

        this.regions;
        this.elements;
        this.events;
        this.behaviors;
    }

    /**
     * Add a behavior to the view instance
     *
     * A behavior can be a Behavior instance or an options object
     *
     * @param {(Object|Function)} behavior The behavior to add
     */
    addBehavior (behavior) {

        if (!(behavior instanceof Behavior)) {

            let behaviorClass = behavior.behaviorClass || Behavior;

            behavior.host = this;

            behavior = new behaviorClass(behavior);
        }

        this.behaviors.push(behavior);

        // bind host events
        behavior._bindHostEvents();

        // bind data events
        behavior._bindDataEvents();

        if (this.isRendered) {}

        if (this.isShown) {
            // bind dom events
            behavior._bindDomEvents();
        }
    }

    addRegion (region) {}

    getTemplate () {

        return this.template;
    }

    getScope () {

        return this.scope;
    }

    setScope (scope) {

        this.scope = scope;
    }

    extendScope (scope) {

        utils.extend(this.scope, scope);
    }

    render (data = {}) {

        utils.extend(this.getScope(), data);

        this.html = tpl.render(this.getTemplate(), this.getScope());

        this.element = dom(this.html);

        this.onRender();

        this.emit('render');

        return this;
    }

    onRender () {}

    show () {

        this.emit('show');
    }

    onShow () {}

    destroy () {

        this.element.remove();
    }

    onDestroy () {}
}
