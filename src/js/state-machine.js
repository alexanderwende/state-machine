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

        return new Promise(function (resolve, reject) {

            if (this.current !== state) {

                resolve(this._exitState(this.current).then(this._enterState(state, params)));
            }
            else {

                resolve(this._enterState(state, params));
            }

        }.bind(this));
    }

    _exitState (state) {

        return new Promise(function (resolve, reject) {

            if (this.states[state]) {

                resolve(this.states[state].exit().then(function () { this.current = null; }.bind(this)));
            }
            else {

                resolve(true);
            }

        }.bind(this));
    }

    _enterState (state, params) {

        return new Promise(function (resolve, reject) {

            if (this.states[state]) {

                resolve(this.states[state].enter(params).then(function () { this.current = state; }.bind(this)));
            }
            else {

                resolve(true);
            }

        }.bind(this));
    }
}

export default StateMachine;
