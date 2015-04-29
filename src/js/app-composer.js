import dom from './composer/services/dom-service';
import utils from './composer/services/utility-service';
import template from './templates/layout.ejs!tpl';

import Component from './composer/component';
import Behavior from './composer/behavior';

(function (window) {

    'use strict';

    console.log('loaded...');

    window.dom = dom;
    window.utils = utils;
    window.template = template;

    class ClickBehavior extends Behavior {

        _onClick (event) {

            event.preventDefault();

            console.log('click-clack...');
        }
    }

    ClickBehavior.defaultOptions = {
        events: [{ target: 'li > a', type: 'click', listener: '_onClick' }]
    };

    class App extends Component {

        constructor (options) {

            this.behaviors = {
                click: {
                    behaviorClass: ClickBehavior
                }
            };

            super(options);
        }
    }

    window.app = new App({
        element: dom.select('#app')
    });

    window.app.start();

})(window);
