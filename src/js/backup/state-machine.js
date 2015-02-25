import State from './state';

class StateMachine {

    constructor (options) {

        this.states = {};

        this.current = null;
        this.default = null;

        if (options) {

            for (let id in options.states) {

                options.states[id].id = id;

                this.state(options.states[id]);
            }

            this.current = options.current || null;
            this.default = options.default || null;
        }
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

        var substate = undefined;
        var index = state.indexOf('.');

        if (index > -1) {
            substate = state.substr(index + 1);
            state = state.substr(0, index);
        }

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
