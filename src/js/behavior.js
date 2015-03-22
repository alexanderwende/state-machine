import dom from './dom';

class Behavior {
    
    constructor (options = {}) {

        this.options = options;
        
        this.host = options.host;

        this.elements = {};

        this.hostEvents = [
            {event: 'render', listener: 'onRender'},
            {event: 'show', listener: 'onShow'},
            {event: 'destroy', listener: 'onDestroy'}
        ];

        this.domEvents;

        this.dataEvents;
    }
    
    _bindHostEvents () {
        
        for (let i = 0, length = this.hostEvents.length; i < length; i++) {

            let event = this.hostEvents[i].event;
            let listener = this.hostEvents[i].listener;

            listener = typeof listener === 'function' ? listener : this[listener].bind(this);

            this.host.addListener(event, listener);
        }
    }
    
    _bindDataEvents () {}

    _bindDomEvents () {
        
        for (let i = 0, length = this.domEvents.length; i < length; i++) {

            let element = this.domEvents[i].element;
            let event = this.domEvents[i].event;
            let listener = this.domEvents[i].listener;

            element = element ? dom(element) : dom(this.host.element);
            listener = typeof listener === 'function' ? listener : this[listener].bind(this);

            element.on(event, listener);
        }
    }

    bind () {}

    unbind () {}

    onRender () {}

    onShow () {}

    onDestroy () {

        this.unbind();
    }
}

export default Behavior;

class CLoseBehavior extends Behavior {

    constructor (options) {

        super(options);

        this.domEvents = [
            {element: '.close', event: 'click', listener: 'onClick'}
        ];
    }

    onClick (event) {

        if (typeof this.options.onClose === 'function') {

            this.options.onClose();
        }
    }
}
