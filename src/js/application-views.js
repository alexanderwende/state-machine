import View from './view';

import layoutTemplate from './templates/layout.ejs!tpl';
import contentTemplate from './templates/content.ejs!tpl';
import navigationTemplate from './templates/navigation.ejs!tpl';

import buttonTemplate from './templates/button.ejs!tpl';

class Layout extends View {

    constructor (options = {}) {

        options.template = options.template || layoutTemplate;

        super(options);

        this.regions = {
            content: '#content',
            aside: '#aside'
        };
    }
}

class ContentView extends View {

    constructor (options = {}) {

        options.template = options.template || contentTemplate;

        super(options);
    }
}

class NavigationView extends View {

    constructor (options = {}) {

        options.template = options.template || navigationTemplate;

        super(options);

        this.events = [
            {
                element: 'li > a',
                event: 'click',
                listener: '_onClick'
            }
        ];
    }

    _onClick (event) {

        event.preventDefault();
        event.stopPropagation();

        console.log('We\'ll get you there later...');
    }
}

class ButtonView extends View {

    constructor (options = {}) {

        options.template = options.template || buttonTemplate;

        super(options);
    }
}

var root = document.querySelector('#main');

window.layout = new Layout().show(root);
window.navigation = new NavigationView().show(document.querySelector('#aside'));

