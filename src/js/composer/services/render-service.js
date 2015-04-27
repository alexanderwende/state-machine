import Service from '../service';
import TemplateService from './template-service';

class RenderService extends Service {

    constructor (options) {

        options.name = 'render';

        super(options);
    }

    render (template, data) {

        return TemplateService.render(template, data);
    }
}

export default RenderService;
