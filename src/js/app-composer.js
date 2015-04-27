import dom from './composer/services/dom-service';
import template from './templates/layout.ejs!tpl';

import Behavior from './composer/behavior';

(function (window) {

    'use strict';

    console.log('loaded...');

    window.dom = dom;
    window.template = template;

    window.behavior = new Behavior({
        host: {
            element: dom.select('#app')
        },
        events: [
            {target: 'li > a', type: 'click', listener: function (event) { console.log('click-clack...'); event.preventDefault(); }}
        ]
    });

})(window);
