import Behavior from '../behavior';
import DomService from '../services/dom-service';
import utils from '../services/utility-service';

class DomBehavior extends Behavior {

    init (options) {

        super(options);

        this.dom = options.domService || DomService;

        this._domEvents = [];
    }

    bindDomEvents () {

        utils.each(this.domEvents, function (event, index) {

            let target = this.dom.select(event.target, this.host.element);

            let listener = (typeof event.listener === 'function') ? event.listener : this[event.listener].bind(this);

            this._domEvents[index] = { type: event.type, target: target, listener: listener };

            target.addEventListener(event.type, listener);

        }, this);
    }

    unbindDomEvents () {

        utils.each(this._domEvents, function (event, index) {

            event.target.removeEventListener(event.type, event.listener);

        }, this);

        this._domEvents = [];
    }

    onRender () {

        console.log('%s domBehavior.onRender()... ', this.id);

        if (this._domEvents.length) {

            this.unbindDomEvents();
        }

        this.bindDomEvents();
    }

    onStop () {

        console.log('%s domBehavior.onStop()... ', this.id);

        this.unbindDomEvents();
    }
}

export default DomBehavior;
