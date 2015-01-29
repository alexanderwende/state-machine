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

        if (this.current) {

            this.transition(this.current);
        }
        else if (this.default) {

            this.transition(this.default);
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

        return new Promise(function (resolve, reject) {

            if (this.current && this.current !== state) {

                this.states[this.current].exit(params).then(function () {})
            }

            if (this.states[state]) {
                // TODO: Finish here
                resolve(this.states[state].enter(params, substate));
            }

        }.bind(this));
    }
}

class State {

    constructor (options) {

        this.name = options && options.name || '';

        this.data = options && options.data || {};


    }

    enter (params, substate) {}

    exit (params) {}
}

export default HierarchicalStateMachine;
