import View from '../../view';
import template from '../templates/app-template.ejs!tpl';

export default class AppView extends View {

    constructor (options) {

        super(options);

        if (!this.template) {
            this.template = template;
        }
    }
}
