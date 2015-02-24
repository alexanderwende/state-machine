class State {

    /**
     * @constructs State
     *
     * @param {Object} [options={}] An options object
     */
    constructor (options = {}) {

        /**
         * @type {Object.<String, State>}
         */
        this.states = {};

        /**
         * @type {State}
         */
        this.parent = options.parent || null;

        /**
         * @type {String}
         */
        this.name = options.name || null;

        /**
         * @type {*}
         */
        this.data = options.data || null;

        this.onEnter = options.onEnter || undefined;
        this.onExit = options.onExit || undefined;

        this.isActive = false;
    }

    transition (state, params) {

        var index = state.indexOf('.'),
            substate = index > -1 ? state.substr(index + 1) : undefined,
            state = index > -1 ? state.substr(0, index) : state,
            promise;

        if (!this.states[state]) {

            return Promise.reject('State \'%s\' does not exist.'.replace('%s', state));
        }

        // TODO: exit the current state
        // TODO: store the current state
        // TODO: implement default transitions for unmatched states
        // TODO: implement method to retrieve current state chain (like 'state.substate.substate')
        // TODO: implement method to add/retrieve substates

        promise = this.states[state].enter(params);

        if (substate) {

            promise = promise.then(function () {
                return this.states[state].transition(substate, params);
            }.bind(this));
        }

        return promise;
    }

    enter (params) {

        if (this.isActive) {

            return Promise.resolve(true);
        }

        return Promise.resolve(this.onEnter(params)).then(function () {

            this.isActive = true;

        }.bind(this));
    }

    onEnter (params) {

        return true;
    }

    exit (params) {

        if (!this.isActive) {

            return Promise.resolve(true);
        }

        return Promise.resolve(this.onExit(params)).then(function () {

            this.isActive = true;

        }.bind(this));
    }

    onExit (params) {

        return true;
    }
}
