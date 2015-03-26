import EventEmitter from './event-emitter';
//import Behavior from './behavior';
import Region from './region';
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
//    addBehavior (behavior) {
//
//        if (!(behavior instanceof Behavior)) {
//
//            let behaviorClass = behavior.behaviorClass || Behavior;
//
//            behavior.host = this;
//
//            behavior = new behaviorClass(behavior);
//        }
//
//        this.behaviors.push(behavior);
//
//        // bind host events
//        behavior._bindHostEvents();
//
//        // bind data events
//        behavior._bindDataEvents();
//
//        if (this.isRendered) {}
//
//        if (this.isShown) {
//            // bind dom events
//            behavior._bindDomEvents();
//        }
//    }

//    addRegion (region) {}

    getTemplate () {

        return this.template;
    }

    bindRegions () {

        if (this.regions) {

            for (let name in this.regions) {

                this.regions[name] = new Region({element: this.regions[name]});
            }
        }
    }

    unbindRegions () {

        if (this.regions) {

            for (let name in this.regions) {

                this.regions[name].destroy();
            }
        }
    }

    bindEvents () {

        if (this.events) {

            for (let i = 0, length = this.events.length; i < length; i++) {

                let event = this.events[i];

                event.element = dom(event.element);
                event.listener = typeof event.listener === 'function' ? event.listener : this[event.listener].bind(this);

                event.element.on(event.event, event.listener);
            }
        }
    }

    unbindEvents () {

        if (this.events) {

            for (let i = 0, length = this.events.length; i < length; i++) {

                let event = this.events[i];

                event.element.off(event.event, event.listener);
            }
        }
    }

    getRegion (name) {

        return this.regions[name];
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

        this.isRendered = true;

        this.bindRegions();

        this.onRender();

        this.emit('render');

        return this;
    }

    onRender () {}

    show (parent) {

        this.parent = dom(parent);

        if (parent.hasChildNodes()) {

            this.bindRegions();
        }
        else {
            if (!this.isRendered) {

                this.render();
            }

            this.parent.append(this.element);
        }

        this.bindEvents();

        this.onShow();

        this.emit('show');

        return this;
    }

    onShow () {}

    destroy () {

        this.unbindEvents();

        this.unbindRegions();

        this.element.remove();

        this.onDestroy();

        this.emit('destroy');
    }

    onDestroy () {}
}
