class State {

    constructor (options) {

        this.id         = options.id;

        this.data       = options.data || {};

        this.onEnter    = options.onEnter;
        this.onExit     = options.onExit;
    }

    enter (params) {

        return new Promise(function (resolve, reject) {

            if (typeof this.onEnter === 'function') {

                resolve(this.onEnter(params));
            }
            else {

                resolve(true);
            }

        }.bind(this));
    }

    exit () {

        return new Promise(function (resolve, reject) {

            if (typeof this.onExit === 'function') {

                resolve(this.onExit());
            }
            else {

                resolve(true);
            }

        }.bind(this));
    }
}

export default State;
