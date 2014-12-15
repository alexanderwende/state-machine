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

    enterState (stateId) {

        var state = this.states[stateId];

        var done = function () {
            this.currentState = state;
        }.bind(this);

        state.enter(done);
    }

    exitState (stateId, done) {

        var state = this.states[stateId];

        state.exit(done);
    }

    transition (stateId) {

        this.exitState(this.currentState.id, function () { this.enterState(stateId); }.bind(this));
    }

//    transition (state) {
//
//        var done = function () {
//
//            var done = function () {
//                this.currentState = state;
//            }.bind(this);
//
//            state.enter(done);
//
//        }.bind(this);
//
//        this.currentState.exit(done);
//    }

    addState (state) {

        this.states[state.id] = state;
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
