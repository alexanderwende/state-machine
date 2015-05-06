import dom from './composer/services/dom-service';
import utils from './composer/services/utility-service';
import template from './templates/layout.ejs!tpl';

import Component from './composer/component';
import ViewComponent from './composer/components/view-component';
import Behavior from './composer/behavior';
import RenderBehavior from './composer/behaviors/render-behavior';
import DomBehavior from './composer/behaviors/dom-behavior';

(function (window) {

    'use strict';

    console.log('loaded...');

    window.dom = dom;
    window.utils = utils;
    window.template = template;



    class AppView extends ViewComponent {

        _onClick (event) {

            event.preventDefault();

            console.log('click-clack...');
        }
    }

    AppView.defaultOptions = ViewComponent.defaultOptions.extend({
        template: template,
        domEvents: [{ target: 'a', type: 'click', listener: '_onClick' }]
    });



//    class Users extends Component {
//
//
//    }
//
//    Users.defaultOptions = Component.defaultOptions.extend({
//        behaviors: [
//            {
//                behaviorClass: StateBehavior
//            }
//        ],
//        states: {
//            list: {
//                route: '/'
//            },
//            details: {
//                route: '/details/:id'
//            }
//        }
//    });

    class App extends Component {

        onStart () {

            this.view = new AppView({
                host: this
            });

            this.view.render();
        }

        onRender () {

            this.view.render();
        }

        onStop () {

            this.view.destroy();
        }
    }

    window.app = new App({
        element: dom.select('#app'),
        routes: {
            'home': {
                path: '/home',
                state: 'home'
            },
            'users': {
                path: '/users',
                state: 'users'
            },
            'users.details': {
                path: '/users/details/:userId',
                state: 'users.details'
            }
        },
        states: {
            'home': {}
        }
    });

    window.app.start();

})(window);
