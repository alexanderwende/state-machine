class HierarchicalStateMachine {

    constructor (options) {

        this.states = {};

        this.current = options && options.current || null;

        this.default = options && options.default || null;

        if (options && options.states) {

            for (let name in options.states) {

                this.state(options.states[name], name);
            }
        }
    }

    state (state, name) {

        switch (typeof state) {

            case 'object':

                state.name = name || state.name;

                this.states[state.name] = new State(state);

                return this;

            case 'string':

                return this.states[state];

            default:

                throw new TypeError('state has to be an object or string');
        }
    }

    transition (state, params) {

        var index, substate;

        index = state.indexOf('.');

        if (index > -1) {

            substate = state.substr(index + 1);
            state = state.substr(0, index);
        }

        console.log('transitioning from %s to %s, params: %o', this.current, state, params);

        var promise;

        if (this.current && this.current !== state) {

            promise = Promise.resolve(this.states[this.current].exit(params)).then(function () {

                this.current = null;

            }.bind(this));
        }
        else {

            promise = Promise.resolve(true);
        }

        if (this.states[state]) {

            promise = promise.then(function () {

                return this.states[state].enter(params, substate).then(function () {

                    this.current = state;

                }.bind(this));

            }.bind(this));
        }
        else {

            promise = promise.then(function () {

                return new Promise.reject('State \'%s\' does not exist.'.replace('%s', state));

            }.bind(this));
        }

        return promise;
    }
}

class State extends HierarchicalStateMachine {

    constructor (options) {

        super(options);

        this.name = options && options.name || '';

        this.data = options && options.data || {};

        this.onEnter = options && options.onEnter || undefined;

        this.onExit = options && options.onExit || undefined;
    }

    enter (params, substate) {

        console.log('entering %s, params: %o, substate: %s', this.name, params, substate);

        var promise;

        if (typeof this.onEnter === 'function') {

            promise = Promise.resolve(this.onEnter(params, substate));
        }
        else {

            promise = Promise.resolve(true);
        }

        if (substate) {

            promise = promise.then(function () {

                return this.transition(substate, params);

            }.bind(this));
        }

        return promise;
    }

    exit (params, substate) {

        console.log('exiting %s, params: %o, substate: %s', this.name, params, substate);

        var promise;

        if (typeof this.onExit === 'function') {

            promise = Promise.resolve(this.onExit(params));
        }
        else {

            promise = Promise.resolve(true);
        }

        return promise;
    }
}

export default HierarchicalStateMachine;
