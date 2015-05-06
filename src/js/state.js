import EventEmitter from './event-emitter';

/**
 * @class State
 */
class State extends EventEmitter {

    /**
     * @constructs State
     *
     * @param {Object} [options={}] An options object
     */
    constructor (options = {}) {

        super();

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

        /**
         * @type {String}
         */
        this.current = options.current || null;

        /**
         * @type {String}
         */
        this.default = options.default || null;

        /**
         * @type {Function}
         */
        this.onEnter = options.onEnter ? options.onEnter.bind(this) : this.onEnter;

        /**
         * @type {Function}
         */
        this.onExit = options.onExit ? options.onExit.bind(this) : this.onExit;

        /**
         * @type {Boolean}
         */
        this.isActive = false;

        // initialize any substates from the configuration
        if (options.states) {

            for (let name in options.states) {

                this.state(options.states[name], name);
            }
        }
    }

    // TODO: implement method to retrieve current state chain (like 'state.substate.substate')
    // TODO: implement event subscription and trigger events on successfull transitions

    /**
     * Add or retrieve a state
     *
     * @param   {(Object|String)} state
     * @param   {String}          [name]
     * @returns {State}           The current state or the retrieved state
     */
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

    /**
     * Transition to a state
     *
     * @param   {String}  state    The name of the state to transition to
     * @param   {*}       [params] Any data that should be passed along
     * @returns {Promise} A promise which will be fulfilled if the transition succeeds
     */
    transition (state, params) {

        var index, substate, promise;

        // extract the first substate key
        index = state.indexOf('.');

        if (index > -1) {

            substate = state.substr(index + 1);
            state = state.substr(0, index);
        }

        // check if the extracted substate exists
        if (!this.states[state]) {

            if (!this.default) {

                return Promise.reject('state \'%s\' does not exist'.replace('%s', state));
            }

            // if there is a default state, reset state and substate
            state = this.default;
            substate = undefined;
        }

        // set up a resolved promise to chain everything else to
        promise = Promise.resolve(true);

        // check if the state has a currently active substate and exit it
        if (this.current && this.current !== state) {

            promise = promise.then(function () {

                return this.states[this.current].exit(params).then(function () {

                    this.current = null;

                }.bind(this));

            }.bind(this));
        }

        // enter the new substate
        promise = promise.then(function () {

            return this.states[state].enter(params).then(function () {

                this.current = state;

            }.bind(this));

        }.bind(this));

        // if the state chain contains a substate, transition
        if (substate) {

            promise = promise.then(function () {

                return this.states[state].transition(substate, params);

            }.bind(this));
        }

        return promise;
    }

    /**
     * Enter the state
     *
     * @param   {*}       [params] - Anything can be passed along with entering a state
     * @returns {Promise} A promise which will be fulfilled when state was entered successfully
     */
    enter (params) {

        if (this.isActive) {

            return Promise.resolve(true);
        }

        return Promise.resolve(this.onEnter(params)).then(function () {

            this.isActive = true;

        }.bind(this));
    }

    /**
     * The default onEnter callback
     *
     * The default callback can be overridden via a constructor option and return a promise
     * to controll the success/failure of the transition.
     *
     * @param   {*}       [params] - The params that have been passed to the enter method
     * @returns {Boolean}
     */
    onEnter (params) {

        return true;
    }

    /**
     * Exit the state
     *
     * @param   {*}       [params] - Anything can be passed along with exiting a state
     * @returns {Promise} A promise which will be fulfilled when state was exited successfully
     */
    exit (params) {

        if (!this.isActive) {

            return Promise.resolve(true);
        }

        return Promise.resolve(this.onExit(params)).then(function () {

            this.isActive = false;

        }.bind(this));
    }

    /**
     * The default onExit callback
     *
     * The default callback can be overridden via a constructor option and return a promise
     * to controll the success/failure of the transition.
     *
     * @param   {*}       [params] - The params that have been passed to the exit method
     * @returns {Boolean}
     */
    onExit (params) {

        return true;
    }
}


export default State;
