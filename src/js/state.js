class State {

    constructor (options) {

        this.id         = options.id;

        this.data       = options.data || {};

        this.onEnter    = options.onEnter;
        this.onExit     = options.onExit;
    }

    enter (params) {

        if (typeof this.onEnter === 'function') {

            this.onEnter(params);
        }
    }

    exit () {

        if (typeof this.onExit === 'function') {

            this.onExit();
        }
    }
}

export default State;
