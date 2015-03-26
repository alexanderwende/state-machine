import EventEmitter from './event-emitter';
import dom from './dom';

class Region extends EventEmitter {

    constructor (options = {}) {

        super();

        this.element = options.element ? dom(options.element) : null;

        this.currentView = null;
    }

    show (view) {

        if (this.currentView) {

            this.currentView.destroy();
        }

        this.element.append(view.isRendered ? view.element : view.render().element);

        this.currentView = view;

        this.emit('show', view);
    }

    destroy () {

        if (this.currentView) {

            this.currentView.destroy();
        }

        this.emit('destroy');
    }
}

export default Region;
