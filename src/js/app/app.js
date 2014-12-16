import Module from '../module';
import AppView from './views/app-view';

import Navigation from '../navigation/navigation';

export default class Application extends Module {

    constructor (options) {

        super(options);

        this.modules = new Map();
    }

    start () {

        super();

        this.layout = new AppView({
            element: this.element,
            selector: this.selector
        });

        this.layout.render();

        this.modules.set('navigation', new Navigation({
            element: this.element.querySelector('.navigation'),
        }));

        this.modules.get('navigation').start();
    }
}
