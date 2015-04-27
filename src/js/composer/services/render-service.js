import TemplateService from './template-service';

var RenderService = {

    name: 'render',

    render: function (template, data) {

        return TemplateService.render(template, data);
    }
}

export default RenderService;
