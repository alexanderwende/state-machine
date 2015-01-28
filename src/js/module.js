import * as utils from './utils';
import StateMachine from './state-machine';
import StateRouter from './state-router';

class Module {

    constructor (options) {

        this.modules = {};

        this._stateMachine = options && options.stateMachine || new StateMachine();

        this._stateRouter = options && options.stateRouter || new StateRouter({ stateMachine: this._stateMachine });

        if (options) {

            this.id         = options.id;
            this.element    = options.element || document.querySelector(options.selector);
            this.selector   = options.selector;

            if (options.onStart) {

                this.onStart = options.onStart.bind(this);
            }
            if (options.onStop) {

                this.onStop = options.onStop.bind(this);
            }

            for (let id in options.states) {

                options.states[id].id = id;

                this.state(options.states[id]);
            }

            for (let id in options.modules) {

                options.modules[id].id = id;

                this.module(options.modules[id]);
            }
        }
    }

    navigate (route, options) {

        if (this.router) {

            this._stateRouter.navigate(route, options);
        }
    }

    module (module) {

        switch (typeof module) {

            case 'object':

                if (!(module instanceof Module)) {

                    module.stateRouter = module.stateRouter || this._stateRouter;

                    module = new Module(module);
                }

                this.modules[module.id] = module;

                break;

            case 'string':

                return this.modules[module];
        }

        return this;
    }

    state (state) {

        switch (typeof state) {

            case 'object':

                this._stateMachine.state(state);

                break;

            case 'string':

                return this._stateMachine.state(state);
        }

        return this;
    }

    start (callback) {

        if (this.isStarted) { return; }

        this.isStarted = true;

        this.onStart(callback);
    }

    onStart (callback) {

        if (typeof callback === 'function') {
            callback(this);
        }
    }

    stop (callback) {

        if (!this.isStarted) { return; }

        this.isStarted = false;

        this.onStop(callback);
    }

    onStop (callback) {

        if (typeof callback === 'function') {
            callback(this);
        }
    }

    destroy () {}

    onDestroy () {

        // implement in module
    }
}

export default Module;
