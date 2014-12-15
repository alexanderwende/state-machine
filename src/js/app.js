import EventQueue from './event-queue';
import StateMachine from './state-machine';

(function () {

    'use strict';

    var app = {

        events: new EventQueue(),

        state: new StateMachine(),

        modules: {},

        addModule: function (moduleId, module) {

            this.modules[moduleId] = module;
        },

        removeModule: function (moduleId) {

            if (this.modules.hasOwnProperty(moduleId)) {
                delete this.modules[moduleId];
            }
        }
    };

    app.addModule('home', {
        selector: '#main',
        element: null,
        template: '<h1>Home</h1>',
        start: function (done) {
            this.element = document.querySelector(this.selector);
            this.element.innerHTML = this.template;
            done();
        }
    });

    app.addModule('about', {
        selector: '#main',
        element: null,
        template: '<h1>About</h1>',
        start: function (done) {
            this.element = document.querySelector(this.selector);
            this.element.innerHTML = this.template;
            done();
        }
    });

    app.state.addState({
        id: 'home',
        route: '/',
        enter: function (done) {
            app.modules['home'].start(done);
        },
        exit: function (done) {
            done();
        }
    });

    app.state.addState({
        id: 'about',
        route: '/about',
        enter: function (done) {
            app.modules['about'].start(done);
        },
        exit: function (done) {
            done();
        }
    });

    app.state.enterState('home');

    window.app = app;

})();
