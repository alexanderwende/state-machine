import EventEmitter from './event-emitter';
import Dom from './dom';
import {render} from './tpl';
import * as utils from './utils';

export default class View extends EventEmiter {

    constructor (options = {}) {

        this.element = options.element || null;

        this.template = options.template || this.template;

        this.isRendered = false;
    }

    getTemplate () {

        return this.template;
    }

    getScope () {

        return this.scope;
    }

    render (options = {}) {

        var html = this.getTemplate()(this.getScope());

        this.onRender();
        this.emit('render');
    }

    onRender () {}

    destroy () {}

    onDestroy () {}

    /**
     * Cache element selectors so they are available after rendering.
     *
     * @private
     */
    _bindElements () {

        var i;

        // back up the element selectors so we can use them after re-rendering
        // but only the first time
        if (!this._elements) {
            this._elements = this.elements || {};
        }

        // we override the elements with an empty object so we don't mess with
        // the prototype
        this.elements = {};

        for (i in this._elements) {
            if (this._elements.hasOwnProperty(i)) {
                this.elements[i] = (typeof this._elements[i] === 'string') ? this.dom(this._elements[i]) : DOM(this._elements[i]);
            }
        }
    }

    /**
     * Create predefined regions so they are available after rendering.
     *
     * @private
     */
    _bindRegions () {

        var i;

        if (!this._regions) {
            this._regions = this.regions || {};
        }

        this.regions = {};

        for (i in this._regions) {
            if (this._regions.hasOwnProperty(i)) {
                this.regions[i] = new Region({element: this.dom(this._regions[i])});
            }
        }
    }

    /**
     * Bind predefined event handlers.
     *
     * @private
     */
    _bindEvents () {

        var i, length, element, event, listener;

        if (!this._events) {
            this._events = this.events || [];
        }

        this.events = [];

        for (i = 0, length = this._events.length; i < length; i++) {

            event = this._events[i].event;
            element= (typeof this._events[i].element === 'string') ? this.dom(this._events[i].element || this.element) : DOM(this._events[i].element || this.element);
            listener = (typeof this._events[i].listener === 'function') ? this._events[i].listener : this[this._events[i].listener].bind(this);

            this.events[i] = {
                event: event,
                element: element,
                listener: listener
            };

            element.bind(event, listener);
        }
    }

    /**
     * Unbind all cached DOM elements
     *
     * @private
     */
    _unbindElements () {

        this.elements = {};
    }

    /**
     * Close and unbind all regions so all nested views are closed properly.
     *
     * @private
     */
    _unbindRegions () {

        var i;

        for (i in this.regions) {
            if (this.regions.hasOwnProperty(i)) {
                this.regions[i].close();
            }
        }

        this.regions = {};
    }

    /**
     * Unbind all predefined event handlers.
     *
     * @private
     */
    _unbindEvents () {

        var i, length;

        for (i = 0, length = this.events.length; i < length; i++) {
            this.events[i].element.unbind(this.events[i].event, this.events[i].listener);
        }

        this.events = [];
    }
}
