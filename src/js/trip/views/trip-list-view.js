import * as utils from '../../utils';
import View from '../../view';
import template from '../templates/trip-list-template.ejs!tpl';

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
