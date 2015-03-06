import buttonTemplate from './templates/button.ejs!tpl';
import Dom from './dom';
import Region from './region';
import View from './view';

class ButtonView extends View {

    constructor (options = {}) {

        options.template = options.template || buttonTemplate;

        super(options);
    }
}

var app = {
    regions: {
        button: new Region({element: '.region-button'}),
        select: new Region({element: '.region-select'})
    },
    start: function () {
        this.regions.button.show(new ButtonView({scope: {label: 'Button', class: 'myClass'}}));
    },
    stop: function () {
        this.regions.button.destroy();
    }
};

app.start();

window.app = app;
