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
            this.default = null;
        }

        transition (state, params) {

            let states = state.split('.');

            state = states.shift();

            if (this.current !== state) {

                this.exitState(this.current);

                this.enterState(state, states, params);
            }
        }

        exitState (state) {

            if (this.states[state]) {
                this.states[state].exit();
            }
        }

        enterState (state, states, params) {

            if (this.states[state]) {
                this.states[state].enter(params);
                this.current = state;
            }
            else if (this.default) {
                this.default.enter(params);
                this.current = this.default;
            }
        }

        state (id, options) {

            if (options) {

                options.id = id;

                let state = new State(options);

                this.states[id] = state;

                if (state.default) {
                    this.default = state;
                }

                return this;
            }

            return this.states[id];
        }
    }



    class State {

        constructor (options) {

            this.id         = options.id;
            this.default    = options.default ? true : false;

            this.data       = {};

            this._enter     = options.enter;
            this._exit      = options.exit;
        }

        enter (params) {

            if (this._enter) {

                this._enter(params);
            }
        }

        exit () {

            if (this._exit) {

                this._exit();
            }
        }
    }



    class Module extends StateMachine {

        constructor (options) {

            super(options);

            this.element = options ? options.element || document.body : document.body;

            this.modules = {};

            this.isStarted = false;
        }

        transition (state, params) {

            super(state, params);

            console.log('state: %s', this.current);
            console.log('state params: %o', params);
        }

        state (id, options) {

            if (options) {

                options.enter   = options.enter ? options.enter.bind(this) : undefined;
                options.exit    = options.exit ? options.exit.bind(this) : undefined;
            }

            return super(id, options);
        }

        module (id, module) {

            if (module) {

                module.id = id;

                this.modules[id] = module;

                return this;
            }

            return this.modules[id];
        }

        start () {

            if (this.isStarted) { return; }

            this.isStarted = true;

            this.transition();
        }

        stop () {

            if (!this.isStarted) { return; }

            this.isStarted = false;
        }
    }



    class Router {

        constructor (options) {

            this.routes = [];

            this.isStarted = false;

            this._onHashChange = function (event) {
                // get the new url from the hashchange event
                var match = event.newURL.match(/#(.+)$/);
                // and extract the hash fragment
                var hash = match && match[1] || '';
                // update the router instance to the new hash
                console.log(hash);
            }.bind(this);
        }

        navigate (url) {}

        start () {

            if (this.isStarted) { return; }

            if ('onhashchange' in window) {
                window.addEventListener('hashchange', this._onHashChange);
            }

            this.isStarted = true;
        }

        stop () {

            if (!this.isStarted) { return; }

            if ('onhashchange' in window) {
                window.removeEventListener('hashchange', this._onHashChange);
            }

            this.isStarted = false;
        }
    }



    class Users extends Module {

        constructor (options) {

            super(options);

            this.state('list', {
                    default: true,
                    enter: function (params) {
                        this.element.innerHTML = '<h1>User List</h1>';
                    },
                    exit: function () {}
                })
                .state('details', {
                    enter: function (params) {
                        this.element.innerHTML = `<h1>User Details: ${params.user}</h1>`;
                    },
                    exit: function () {}
                })
                .state('edit', {
                    enter: function (params) {
                        this.element.innerHTML = `<h1>Edit User Details: ${params.user}</h1>`;
                    },
                    exit: function () {}
                });
        }
    }

    class App extends Module {

        constructor (options) {

            super(options);

            this.module('users', new Users());

            this.state('home', {
                    default: true,
                    enter: function (params) {
                        this.element.innerHTML = '<h1>Home</h1>';
                    },
                    exit: function () {}
                })
                .state('about', {
                    enter: function (params) {
                        this.element.innerHTML = '<h1>About</h1>';
                    },
                    exit: function () {}
                })
                .state('users', {
                    enter: function (params) {},
                    exit: function () {}
                });
        }
    }

    window.router = new Router();

    window.router.start();

    window.app = new App({
        element: document.getElementById('app')
    });

    app.start();

})();
