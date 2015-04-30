import utils from './utility-service';

class DomWrapper {

    /**
     * @constructor
     *
     * @param {EventTarget|NodeList|Array|DomWrapper} elements The DOM elements to wrap
     */
    constructor (elements) {

        this.elements = [];

        if (elements instanceof EventTarget) {

            // Node, DocumentFragment and Element are subclasses of EventTarget,
            // but EventTarget also covers the window object
            if (elements instanceof DocumentFragment) {

                elements = elements.childNodes;
            }
            else {

                elements = [elements];
            }
        }
        else if (elements instanceof DomWrapper) {

            elements = elements.elements;
        }

        // at this point, elements is either an Array of elements or a NodeList
        for (let i = 0, length = this.length = elements.length || 0; i < length; this.elements[i] = elements[i++]);
    }

    get length () {

        return this.elements.length;
    }

    set length (length) {

        return this.elements.length = length;
    }

    query (selector) {

        return DomService.query(selector, this);
    }

    attribute () {}

    getAttribute () {}
    setAttribute () {}
    removeAttribute () {}

    append (content) {

        return DomService.append(content, this);
    }

    insert (content) {

        return DomService.insert(content, this);
    }

    remove () {

        return DomService.remove(this);
    }

    empty () {

        return DomService.empty(this);
    }

    addEventListener (event, listener, useCapture) {

        return DomService.addEventListener(this, event, listener, useCapture);
    }

    removeEventListener() {

        return DomService.removeEventListener(this, event, listener, useCapture);
    }
}

var DomService = {

    name: 'dom',

    /**
     * Make a DOM selection
     *
     * @param   {String|EventTarget|NodeList|Array|DomWrapper} selector  A query selector string, HTML string or actual DOM content
     * @param   {Element|NodeList|Array|DomWrapper}            [context] A context for the query selector
     * @returns {DomWrapper}                                   A DomWrapper instance
     */
    select: function (selector, context) {

        if (typeof selector === 'string') {

            if (this.isHTML(selector)) {

                return this.parse(selector);
            }
            else {

                return this.query(selector, context);
            }
        }
        else {

            return new DomWrapper(selector);
        }
    },

    /**
     * Query the DOM with a query selector
     *
     * @param   {String}                            selector                           The query selector
     * @param   {Element|NodeList|Array|DomWrapper} [context=document.documentElement] A context for the query selector
     * @returns {DomWrapper}                        A DomWrapper instance
     */
    query: function (selector, context = document.documentElement) {

        let elements = [];

        context = context || document.documentElement;

        if (context instanceof DomWrapper) {

            context = context.elements;
        }

        if (context instanceof NodeList || context instanceof Array) {

            for (let i = 0; i < context.length; i++) {

                elements = elements.concat(this.query(selector, context[i]).elements);
            }
        }
        else {

            elements = context.querySelectorAll(selector);
        }

        return new DomWrapper(elements);
    },

    /**
     * Turn an HTML string into DOM elements
     *
     * @param   {String}     html The HTML string
     * @returns {DomWrapper} The parsed html
     */
    parse: function (html) {

        return new DomWrapper(this.createDocumentFragment(html));
    },

    /**
     * Check if a string is an HTML string
     *
     * @param   {String}  html The HTML string to check
     * @returns {Boolean} True if the string is an HTML string
     */
    isHTML: function (html) {

        if (typeof html === 'string') {

            html = html.trim();

            return (html[0] === "<" && html[html.length - 1] === ">" && html.length > 2);
        }

        return false;
    },

    /**
     * Create a DocumentFragment from an HTML string/Element/NodeList/...
     *
     * @param   {String|Element|NodeList|Array|DomWrapper} html [[Description]]
     * @returns {DocumentFragment}                         [[Description]]
     */
    createDocumentFragment: function (html) {

        let fragment = document.createDocumentFragment(),
            helper;

        if (html) {

            if (this.isHTML(html)) {

                helper = document.createElement('div');
                helper.innerHTML = html;

                while (helper.firstChild) {

                    fragment.appendChild(helper.firstChild);
                }
            }
            else {

                if (html instanceof DocumentFragment) {

                    fragment = html;
                }
                else {

                    html = new DomWrapper(html);

                    utils.each(html.elements, function (element) {

                        fragment.appendChild(element);
                    });
                }
            }
        }

        return fragment;
    },

    append: function (content, target) {

        content = this.createDocumentFragment(content);

        target = (target instanceof DomWrapper) ? target : this.select(target);

        utils.each(target.elements, function (target) {

            target.appendChild(content.cloneNode(true));
        });

        return target;
    },

    insert: function (content, target) {

        content = this.createDocumentFragment(content);

        target = (target instanceof DomWrapper) ? target : this.select(target);

        utils.each(target.elements, function (target) {

            this.empty(target).append(content);

        }, this);

        return target;
    },

    remove: function (element) {

        element = (element instanceof DomWrapper) ? element : this.select(element);

        utils.each(element.elements, function (element) {

            if (element.parentNode) {

                element.parentNode.removeChild(element);
            }
        });

        return element;
    },

    empty: function (element) {

        element = (element instanceof DomWrapper) ? element : this.select(element);

        utils.each(element.elements, function (element) {

            if (element instanceof Element) {

                element.innerHTML = '';
            }
            else if (element instanceof Node) {

                while (element.firstChild) {

                    element.removeChild(element.firstChild);
                }
            }
        });

        return element;
    },

    /**
     * Add an event listener
     *
     * @param   {Element|NodeList|Array|DomWrapper} element            The element to attach the event to
     * @param   {String}                            event              The event type
     * @param   {Function}                          listener           The event listener
     * @param   {Boolean}                           [useCapture=false] Add listener in capturing mode
     * @returns {DomWrapper}                        A DomWrapper instance
     */
    addEventListener: function (element, event, listener, useCapture = false) {

        if (!(element instanceof DomWrapper)) {

            element = new DomWrapper(element);
        }

        utils.each(element.elements, function (element) {

            element.addEventListener(event, listener, useCapture);
        });

        return element;
    },

    /**
     * Remove an event listener
     *
     * @param   {Element|NodeList|Array|DomWrapper} element            The element to remove the event from
     * @param   {String}                            event              The event type
     * @param   {Function}                          listener           The event listener
     * @param   {Boolean}                           [useCapture=false] Remove listener in capturing mode
     * @returns {DomWrapper}                        A DomWrapper instance
     */
    removeEventListener: function (element, event, listener, useCapture = false) {

        if (!(element instanceof DomWrapper)) {

            element = new DomWrapper(element);
        }

        utils.each(element.elements, function (element) {

            element.removeEventListener(event, listener, useCapture);
        });

        return element;
    }
};

export default DomService;
