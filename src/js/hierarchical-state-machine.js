class HierarchicalStateMachine {

    constructor (options) {

        this.states = {};

        this.parent = options && options.parent || null;

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
                state.parent = this;

                this.states[state.name] = new State(state);

                return this;

            case 'string':

                return this.states[state];

            default:

                throw new TypeError('state has to be an object or string');
        }
    }

    transition (state, params) {

        var index, substate, current;

        current = this.current;
        index = state.indexOf('.');

        if (index > -1) {

            substate = state.substr(index + 1);
            state = state.substr(0, index);
        }

        if (current) {

            if (current !== state) {

                return this._exit(current, params).then(function () {

                    return this._enter(state, params, substate);

                }.bind(this));
            }

            return this.states[state].transition(substate, params);
        }

        return this._enter(state, params, substate);
    }

    _enter (state, params, substate) {

        if (this.states[state]) {

            return Promise.resolve(this.states[state].enter(params, substate).then(function () {

                this.current = state;

            }.bind(this)));
        }
        else {

            return Promise.reject('State \'%s\' does not exist.'.replace('%s', state));
        }
    }

    _exit (state, params) {

        if (this.states[state]) {

            return Promise.resolve(this.states[state].exit(params).then(function () {

                this.current = null;

            }.bind(this)));
        }
        else {

            return Promise.reject('State \'%s\' does not exist.'.replace('%s', state));
        }
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
