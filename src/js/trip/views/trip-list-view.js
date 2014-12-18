import View from '../../view';
import template from '../templates/trip-list-template.ejs!tpl';

export default class TripListView extends View {

    constructor (options) {

        super(options);

        if (!this.template) {
            this.template = template;
        }
    }
}
