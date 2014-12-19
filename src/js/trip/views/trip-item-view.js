import View from '../../view';
import template from '../templates/trip-item-template.ejs!tpl';

export default class TripItemView extends View {

    constructor (options) {

        super(options);

        if (!this.template) {
            this.template = template;
        }
    }
}
