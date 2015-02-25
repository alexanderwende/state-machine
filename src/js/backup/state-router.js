import Router from './router';

class StateRouter extends Router {

    constructor (options) {

        super(options);

        this.stateMachine = options.stateMachine;
    }

    route (route) {

        if (typeof route === 'object') {

            let state           = route.state;
            let stateMachine    = this.stateMachine;

            route.id = state;

            route.handler = function (params) {

                console.log('handling route %s, path: %s, params: %o', state, route.path, params);

                stateMachine.transition(state, params);
            }
        }

        return super(route);
    }
}

export default StateRouter;
