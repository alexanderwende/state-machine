import Behavior from '../behavior';
import utils from '../services/utility-service';

class StateBehavior extends Behavior {

    init (options) {

        super(options);

        utils.each(this.states, function (state, key) {

            this.state(state, key);

        }, this);
    }

    state (state, name) {

        switch (typeof state) {

            case 'object':

                state.name = name || state.name;
                state.parent = this;

                let onEnter = state.name + 'Enter';
                let onExit = state.name + 'Exit';

                state.onEnter = typeof state.onEnter === 'function' ? state.onEnter :
                                typeof this[onEnter] === 'function' ? this[onEnter].bind(this) :
                                typeof this.host[onEnter] === 'function' ? this.host[onEnter].bind(this) : null;

                state.onExit = typeof state.onExit === 'function' ? state.onExit :
                                typeof this[onExit] === 'function' ? this[onExit].bind(this) :
                                typeof this.host[onExit] === 'function' ? this.host[onExit].bind(this) : null;

                this._states[state.name] = state;

                break;

            case 'string':

                return this._states[state];
        }

        return this;
    }

    transition (state, params) {}


}

StateBehavior.defaultOptions = {
    states: null
};

export default StateBehavior;
