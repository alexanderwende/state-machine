import buttonTemplate from './templates/button.ejs!tpl';
import Dom from './dom';
import View from './view';

class ButtonView extends View {

    constructor (options = {}) {

        options.template = options.template || buttonTemplate;

        super(options);
    }
}

window.button = new ButtonView();

button.render({
    label: 'Button',
    class: 'button'
});

document.querySelector('.section-button').innerHTML = button.html;

//buttonTemplate({
//    label: 'Button',
//    class: 'button'
//});
