import * as Utils from './utils';
import Request from './request';
import Route from './route';
import Router from './router';
import Mediator from './mediator';
import State from './state';


//window.r = new StateRouter({
//    stateMachine: sm
//});
//
//r.route({
//    path: '/home',
//    state: 'home'
////    handler: function () {
////        console.log('handling route /home...');
////    }
//});
//
//r.route({
//    path: '/users',
//    state: 'users'
////    handler: function () {
////        console.log('handling route /users...');
////    }
//});
//
//r.route({
//    path: '/users/list',
//    state: 'users.list'
////    handler: function () {
////        console.log('handling route /users/list...');
////    }
//});
//
//r.route({
//    path: '/users/:userId/details',
//    state: 'users.details'
////    handler: function (params) {
////        console.log('handling route /users/:userId/details... params: %o', params);
////    }
//});


//window.app = new Module({
//    selector: '#app',
//    states: {
//        'home': {
//            onEnter: function () { console.log('entering home...'); }
//        },
//        'users': {
//            onEnter: function () { console.log('entering users...'); }
//        }
//    },
//    modules: {
//        'users': {
//            selector: '#users',
//            states: {
//                'list': {
//                    onEnter: function () { console.log('entering users.list...'); }
//                },
//                'details': {
//                    onEnter: function () { console.log('entering users.details...'); }
//                },
//                'edit': {
//                    onEnter: function () { console.log('entering users.edit...'); }
//                }
//            }
//        }
//    },
//    onStart: function (callback) {
//        console.log('starting app...');
//        this._stateRouter.start();
//    }
//});
//
//window.app.start();

window.Utils = Utils;
window.Request = Request;
window.Route = Route;
window.Router = Router;
window.Mediator = Mediator;
window.State = State;

window.r = new Router({
    routes: {
        'home': {
            path: '/home',
            handler: function () { console.log('home...'); }
        },
        'users': {
            path: '/users',
            handler: function () { console.log('users...'); }
        },
        'users.details': {
            path: '/users/details/:userId',
            handler: function (params) { console.log('users.details... userId: %s', params.userId); }
        }
    },
    default: 'home'
});

window.r.start();

window.s = new State({
    name: 'root',
    states: {
        home: {
            onEnter: function (params) { console.log('welcome to home'); },
            onExit: function (params) { console.log('goodbye from home'); }
        },
        users: {
            onEnter: function (params) { console.log('welcome to users'); },
            onExit: function (params) { console.log('goodbye from users'); },
            states: {
                list: {
                    onEnter: function (params) { console.log('welcome to users.list'); },
                    onExit: function (params) { console.log('goodbye from users.list'); }
                },
                details: {
                    onEnter: function (params) { console.log('welcome to users.details'); },
                    onExit: function (params) { console.log('goodbye from users.details'); }
                }
            }
        }
    }
});
