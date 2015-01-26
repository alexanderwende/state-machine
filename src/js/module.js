export default class Module {

    constructor (options) {

        if (options) {

            this.element    = options.element || document.querySelector(options.selector);
            this.selector   = options.selector;

            this.stateMachine   = options.stateMachine;
            this.router         = options.router;

            if (options.onStart) {

                this.onStart = options.onStart.bind(this);
            }
            if (options.onStop) {

                this.onStop = options.onStop.bind(this);
            }
        }
    }

    navigate (route, options) {

        if (this.router) {

            this.router.navigate(route, options);
        }
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
