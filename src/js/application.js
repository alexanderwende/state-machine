import HSM from './hierarchical-state-machine';

//window.sm = new StateMachine();
//
//sm.state({
//    id: 'home',
//    onEnter: function () {
//        console.log('entering home...');
//    }
//});
//
//sm.state({
//    id: 'users',
//    onEnter: function () {
//        console.log('entering users...');
//    }
//});
//
//sm.state({
//    id: 'users.list',
//    onEnter: function () {
//        console.log('entering users.list...');
//    }
//});
//
//sm.state({
//    id: 'users.details',
//    onEnter: function (params) {
//        console.log('entering users.details... params: %o', params);
//    }
//});

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


window.hsm = new HSM({
    states: {
        home: {
            onEnter: function (params) { console.log('entering home, params: %o', params); },
            onExit: function (params) { console.log('exiting home, params: %o', params); }
        },
        users: {
            onEnter: function (params) { console.log('entering users, params: %o', params); },
            onExit: function (params) { console.log('exiting users, params: %o', params); }
        }
    }
});
