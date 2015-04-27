import TemplateService from '../services/template-service';

function translate (load) {

    load.source = TemplateService.compile(load.source);
};

export {translate};
