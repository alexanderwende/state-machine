import EventEmitter from './event-emitter';
import dom from './dom';
import * as utils from './utils';
import * as tpl from './tpl';

export default class View extends EventEmitter {

    constructor (options = {}) {

        super();

        this.element = options.element || null;

        this.template = options.template || this.template;

        this.scope = utils.extend({}, options.scope);

        this.html = '';

        this.isRendered = false;
    }

    getTemplate () {

        return this.template;
    }

    getScope () {

        return this.scope;
    }

    setScope (scope) {

        this.scope = scope;
    }

    extendScope (scope) {

        utils.extend(this.scope, scope);
    }

    render (data = {}) {

        utils.extend(this.getScope(), data);

        this.html = tpl.render(this.getTemplate(), this.getScope());

        this.element = dom(this.html);

        this.onRender();

        this.emit('render');
    }

    onRender () {}

    destroy () {}

    onDestroy () {}
}
