import Behavior from '../behavior';
import RenderService from '../services/render-service';

class RenderBehavior extends Behavior {

    constructor (options) {

        super(options);

        this.template = options.template || null;

        this.data = options.data || null;

        this.renderService = options.renderService || RenderService;
    }

    onRender () {

        this.renderService.render(this.template, this.data);
    }
}

export default RenderBehavior;
