export default class Module {

    constructor (options) {

        if (options) {

            this.element    = options.element || document.querySelector(options.selector);
            this.selector   = options.selector;
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

    onStop () {

        if (typeof callback === 'function') {
            callback(this);
        }
    }

    destroy () {}

    onDestroy () {

        // implement in module
    }
}
