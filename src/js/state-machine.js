class StateMachine {

    constructor (options) {

        this.states = {};
        this.currentState = null;

        if (options && options.initialState) {

            this.enterState(options.initialState);
        }
    }

    handleEvent (event) {

        var state = this.currentState.handleEvent(event);

        if (state) {

            this.transition(state);
        }
    }

    handleInput (input) {

        var state = this.currentState.handleInput(input);

        if (state) {

            this.transition(state);
        }
    }

    enterState (stateId, params) {

        var state = this.states[stateId];

        var done = function () {
            this.currentState = state;
        }.bind(this);

        state.enter(params, done);
    }

    exitState (stateId, done) {

        var state = this.states[stateId];

        state.exit(done);
    }

    transition (stateId, params) {

        if (!this.currentState) {
            this.enterState(stateId, params);
        }
        else {
            this.exitState(this.currentState.id, function () { this.enterState(stateId, params); }.bind(this));
        }
    }

    addState (state) {

        this.states[state.id] = state;
    }

    removeState (state) {

        delete this.states[state.id];
    }
}

class State {

    constructor (options) {

        this.id = options.id;
    }

    handleEvent (event) {}

    handleInput (input) {}

    enter (done) {

        return done();
    }

    exit (done) {

        return done();
    }
}

export default StateMachine;
