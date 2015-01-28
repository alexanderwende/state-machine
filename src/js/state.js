import StateMachine from './state-machine';

class State extends StateMachine {

    constructor (options) {

        this.id         = options.id;

        this.data       = options.data || {};

        this.onEnter    = options.onEnter;
        this.onExit     = options.onExit;

        super(options);
    }

    enter (params, substate) {

        return new Promise(function (resolve, reject) {

            if (typeof this.onEnter === 'function') {

                if (substate) {

                    this.onEnter(params);

                    resolve(this.transition(substate, params));
                }
                else {

                    resolve(this.onEnter(params));
                }
            }
            else {

                if (substate) {

                    resolve(this.transition(substate, params));
                }
                else {

                    resolve(true);
                }
            }

        }.bind(this));
    }

    exit (params, substate) {

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
