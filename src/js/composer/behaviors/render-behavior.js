import Behavior from '../behavior';
import DomService from '../services/dom-service';
import RenderService from '../services/render-service';

class RenderBehavior extends Behavior {

    init (options) {

        super(options);

        this.domService = options.domService || DomService;

        this.renderService = options.renderService || RenderService;
    }

    onRender () {

        console.log('renderBehavior.onRender()... ');

        let template = this.host.getTemplate();

        let data = this.host.getData();

        let content = this.renderService.render(template, data);

        this.domService.insert(content, this.host.element);
    }
}

export default RenderBehavior;
