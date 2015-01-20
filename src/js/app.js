import DOM from './dom';
import EventQueue from './event-queue';
import StateMachine from './state-machine';
import Application from './app/app';

(function () {

    'use strict';

//    var app = {
//
//        events: new EventQueue(),
//
//        state: new StateMachine(),
//
//        modules: {},
//
//        addModule: function (moduleId, module) {
//
//            this.modules[moduleId] = module;
//        },
//
//        removeModule: function (moduleId) {
//
//            if (this.modules.hasOwnProperty(moduleId)) {
//                delete this.modules[moduleId];
//            }
//        }
//    };
//
//    app.addModule('home', {
//        selector: '#main',
//        element: null,
//        template: '<h1>Home</h1>',
//        start: function (done) {
//            this.element = document.querySelector(this.selector);
//            this.element.innerHTML = this.template;
//            done();
//        }
//    });
//
//    app.addModule('about', {
//        selector: '#main',
//        element: null,
//        template: '<h1>About</h1>',
//        start: function (done) {
//            this.element = document.querySelector(this.selector);
//            this.element.innerHTML = this.template;
//            done();
//        }
//    });
//
//    app.state.addState({
//        id: 'home',
//        route: '/',
//        enter: function (params, done) {
//            app.modules['home'].start(done);
//            app.modules['home'].handleEvent(params);
//        },
//        exit: function (params, done) {
//            done();
//        }
//    });
//
//    app.state.addState({
//        id: 'about',
//        route: '/about',
//        enter: function (params, done) {
//            app.modules['about'].start(done);
//        },
//        exit: function (params, done) {
//            done();
//        }
//    });
//
//    app.state.enterState('home');

    class StateMachine {

        constructor (options) {

            this.states = {};

            this.current = null;
        }

        transition (fromState, toState, params) {

            if (fromState !== toState) {

                fromState.exit();

                toState.enter(params);
            }
        }
    }

    class Module extends StateMachine {

        constructor (options) {

            super(options);
        }
    }

    class Router {

        constructor (options) {}

        navigate (url) {}
    }

    class App extends Module {

        constructor (options) {

            super(options);

            this.states = {

                'home': {
                    enter: function (params) {},
                    exit: function () {}
                },

                'about': {
                    enter: function (params) {},
                    exit: function () {}
                }
            };
        }
    }


})();
