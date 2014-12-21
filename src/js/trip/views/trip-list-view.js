import View from '../../view';
import template from '../templates/trip-list-template.ejs!tpl';

function extend (target, source, deep) {

    for (let property in source) {
        if (source.hasOwnProperty(property)) {
            target[property] = clone(source[property], deep);
        }
    }

    return target;
}

function clone (source, deep) {

    if (typeof source === 'object') {
        if (deep) {
            if (source instanceof Object) {
                return extend({}, source, deep);
            }
            else if (source instanceof Array) {
                return extend([], source, deep);
            }
            else {
                return new source.constructor(source);
            }
        }
    }

    return source;
}

export default class TripListView extends View {

    constructor (options) {

        this.defaultOptions = {
            template: template,
            events: [
                {element: 'a', event: 'click', handler: '_handleClick'}
            ]
        };

        options = extend(this.defaultOptions, options);

        super(options);
    }

    onRender () {


    }
}
