export default class View {

    constructor (options) {

        if (options) {

            this.element    = options.element || document.querySelector(options.selector);
            this.selector   = options.selector;
            this.scope      = options.scope;
            this.template   = options.template;
            this.module     = options.module;
        }
    }

    getTemplate () {

        return this.template;
    }

    getScope () {

        return this.scope;
    }

    render () {

        this.element.innerHTML = this.getTemplate()(this.getScope());

        this.onRender();
    }

    onRender () {}
}
