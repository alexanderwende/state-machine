import View from '../../view';
import template from '../templates/navigation-template.ejs!tpl';

export default class NavigationView extends View {

    constructor (options) {

        super(options);

        if (!this.template) {
            this.template = template;
        }
    }
}
