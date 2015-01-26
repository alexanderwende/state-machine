import State from './state';

class StateMachine {

    constructor (options) {

        this.states = {};

        this.current = null;
        this.default = null;
    }

    state (state) {

        switch (typeof state) {

            case 'object':

                if (!(state instanceof State)) {

                    state = new State(state);
                }

                this.states[state.id] = state;

                break;

            case 'string':

                return this.states[state];
        }

        return this;
    }

    transition (state, params) {

        if (this.current !== state) {

            this._exitState(this.current);
        }

        this._enterState(state, params);
    }

    _exitState (state) {

        if (this.states[state]) {

            this.states[state].exit();

            this.current = null;
        }
    }

    _enterState (state, params) {

        if (this.states[state]) {

            this.states[state].enter(params);

            this.current = state;
        }
    }
}

export default StateMachine;
