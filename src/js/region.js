import EventEmitter from './event-emitter';
import dom from './dom';

class Region extends EventEmitter {

    constructor (options = {}) {

        this.selector = options.selector || null;
        this.element = options.element || null;
        this.current = null;
    }

    show (view) {

        this.element.empty();

        this.element.append(view.isRendered ? view.element : view.render().element);

        this.current = view;

        this.emit('show');
    }

    destroy () {


    }
}

export default Region;
