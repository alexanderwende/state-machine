import Module from '../module';
import NavigationView from './views/navigation-view';

export default class Navigation extends Module {

    constructor (options) {

        super(options);
    }

    start () {

        super();

        this.view = new NavigationView({
            element: this.element,
            selector: this.selector,
            scope: {
                items: [
                    {
                        url: '#/',
                        label: 'Home'
                    },
                    {
                        url: '#/settings',
                        label: 'Settings'
                    }
                ]
            }
        });

        this.view.render();
    }
}
