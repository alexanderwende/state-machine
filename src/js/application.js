import StateMachine from './state-machine';
import Module from './module';
import Route from './route';
import Router from './router';
import StateRouter from './state-router';

window.sm = new StateMachine();

sm.state({
    id: 'home',
    onEnter: function () {
        console.log('entering home...');
    }
});

sm.state({
    id: 'users',
    onEnter: function () {
        console.log('entering users...');
    }
});

sm.state({
    id: 'users.list',
    onEnter: function () {
        console.log('entering users.list...');
    }
});

sm.state({
    id: 'users.details',
    onEnter: function (params) {
        console.log('entering users.details... params: %o', params);
    }
});

window.r = new StateRouter({
    stateMachine: sm
});

r.route({
    path: '/home',
    state: 'home'
//    handler: function () {
//        console.log('handling route /home...');
//    }
});

r.route({
    path: '/users',
    state: 'users'
//    handler: function () {
//        console.log('handling route /users...');
//    }
});

r.route({
    path: '/users/list',
    state: 'users.list'
//    handler: function () {
//        console.log('handling route /users/list...');
//    }
});

r.route({
    path: '/users/:userId/details',
    state: 'users.details'
//    handler: function (params) {
//        console.log('handling route /users/:userId/details... params: %o', params);
//    }
});


window.users = new Module({
    selector: '#users',
    states: {
        'list': {},
        'details': {},
        'edit': {}
    }
});

window.app = new Module({
    selector: '#app',
    states: {
        'home': {},
        'users': {}
    }
});

window.app.start();

window.Route = Route;
