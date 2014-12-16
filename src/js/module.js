export default class Module {

    constructor (options) {

        if (options) {

            this.element    = options.element || document.querySelector(options.selector);
            this.selector   = options.selector;
        }
    }

    start () {

        if (this.isStarted) { return; }

        this.isStarted = true;
    }

    stop () {

        if (!this.isStarted) { return; }

        this.isStarted = false;
    }
}
