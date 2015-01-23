import StateMachine from './state-machine';
import Module from './module';


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
