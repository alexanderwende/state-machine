import * as utils from './utils';

/**
 * DOM class hierarchy:
 *
 * EventTarget
 *      addEventListener()
 *      removeEventListener()
 *      dispatchEvent()
 *
 * Node
 *      childNodes/firstChild/lastChild/previousSibling/nextSibling/parentNode/nodeName/nodeType
 *      appendChild()
 *      insertBefore()
 *      removeChild()
 *      contains()
 *      replaceChild()
 *
 * Element
 *      attributes/children/className/classList/innerHTML/...
 *      getAttribute()/hasAttribute()/setAttribute()/removeAttribute()
 *      insertAdjacentHTML()
 *      querySelector()/querySelectorAll()
 *      remove()
 *
 */

/**
 * A string which can be a selector or HTML markup, a Node or Element or NodeList or an Array of the former.
 *
 * @typedef {(String|EventTarget|Node|Element|NodeList|Array|DOMQuery)} QueryInput
 */

class DOMQuery extends Array {

    /**
     * Create a new DOMQuery
     *
     * @constructor
     * @param {QueryInput} selector
     * @param {(EventTarget|NodeList|Array)} context
     * @returns {DOMQuery}
     */
    constructor (selector, context) {

        var i, result;

        // the selector can either be an html string or an actual selector string
        if (typeof selector === 'string') {

            if (DOMQuery.isHTML(selector)) {

                return DOMQuery.parse(selector);
            }

            return DOMQuery.query(selector, context);
        }

        // this allows DOMQuery to be called as a function
        if (!(this instanceof DOMQuery)) {

            return new DOMQuery(selector, context);
        }

        super();

        if (selector instanceof NodeList || selector instanceof Array) {

            result = selector;
        }
        else if (selector instanceof EventTarget) {
            // Node is a subclass of EventTarget, but
            // EventTarget also covers the window object
            if (selector instanceof DocumentFragment) {

                result = selector.childNodes;
            }
            else {

                result = [selector];
            }
        }

        // the last step simply copies all nodes from the result set to this DOMQuery instance
        for (i = this.length = result.length || 0; i--; this[i] = result[i]);

        return this;
    }

    /**
     * Create a new DOMQuery with the current query being the context
     *
     * @param {QueryInput} selector
     * @returns {DOMQuery}
     */
    find (selector) {

        return DOMQuery(selector, this);
    }

    /**
     * Test equality of two DOM selections
     *
     * @param {(string|Node|NodeList|Array|DOM)} selector
     * @returns {boolean}
     */
    is (selector) {

        selector = (selector instanceof DOMQuery) ? selector : new DOMQuery(selector);

        if (this.length === selector.length) {

            for (let i = this.length; i--;) {

                if (this[i] !== selector[i]) { return false; }
            }

            return true;
        }

        return false;
    }


    /**
     * Clone a DOMQuery
     *
     * @returns {DOMQuery}
     */
    clone () {

        var clone = new DOMQuery();

        for (let i = clone.length = this.length; i--;) {

            let node = this[i];

            // the cloneNode method is part of the Node interface
            if (node instanceof Node) {

                clone[i] = node.cloneNode(true);
            }
            // make sure window gets copied when cloning (not a node)
            else {

                clone[i] = node;
            }
        }

        return clone;
    }

    /**
     * Add content to a DOMQuery
     *
     * @param {string|Node|NodeList|Array} content
     * @returns {DOMQuery}
     */
    add (content) {

        if (typeof content === "string") {

            return this.add(new DOMQuery(content));
        }

        if (content instanceof Node) {

            this.push(content);
        }
        else if (content instanceof NodeList || content instanceof Array) {

            for (let i = 0, length = content.length; i < length; i++) {

                this.push(content[i]);
            }
        }

        return this;
    }

    /**
     * Manipulate the attributes of a DOM element
     *
     * This method is a shortcut for retrieving, setting
     * or removing attributes on a DOM element.
     *
     * @param {string} attribute
     * @param {string} [value]
     * @returns {*}
     */
    attribute (attribute, value) {

        if (value === undefined) {

            return this.getAttribute(attribute);
        }
        else {

            if (value === null || value === "") {

                return this.removeAttribute(attribute);
            }
            else {

                return this.setAttribute(attribute, value);
            }
        }
    }

    /**
     * Get an attribute value
     *
     * @param {string} attribute
     * @returns {string|undefined}
     */
    getAttribute (attribute) {

        // the getAttribute method is part of the Element interface
        if (this[0] instanceof Element) {

            return this[0].getAttribute(attribute);
        }

        return undefined;
    }

    /**
     * Set an attribute value
     *
     * @param {string} attribute
     * @returns {DOMQuery}
     */
    setAttribute (attribute, value) {

        for (let i = this.length; i--;) {

            let node = this[i];

            // the setAttribute method is part of the Element interface
            if (node instanceof Element) {

                node.setAttribute(attribute, value);
            }
        }

        return this;
    }

    /**
     * Check for a certain attribute
     *
     * @param {string} attribute
     * @returns {boolean}
     */
    hasAttribute (attribute) {

        for (let i = this.length; i--;) {

            let node = this[i];

            // the hasAttribute method is part of the Element interface
            if (node instanceof Element) {

                return node.hasAttribute(attribute);
            }
        }

        return false;
    }

    /**
     * Remove an attribute
     *
     * @param {string} attribute
     * @returns {DOMQuery}
     */
    removeAttribute (attribute) {

        for (let i = this.length; i--;) {

            let node = this[i];

            // the removeAttribute method is part of the Element interface
            if (node instanceof Element) {

                node.removeAttribute(attribute);
            }
        }

        return this;
    }

    /**
     * Get the value of a form element
     *
     * @returns {string}
     */
    value () {

        var element = this[0];
        var value = "";

        if (element instanceof HTMLSelectElement) {
            value = element.value;
        }
        else if (element instanceof HTMLTextAreaElement) {
            value = element.value;
        }
        else if (element instanceof HTMLInputElement) {
            value = element.value;
        }

        return value;
    }

    /**
     * Append content to a DOMQuery
     *
     * @param   {QueryInput} content The content to append
     * @returns {DOMQuery}   The DOMQuery
     */
    append (content) {

        var i, length;

        // if content is a string, it can be html or a selector
        // so we create a new DOMQuery instance to cover these cases
        if (typeof content === 'string') {

            content = new DOMQuery(content);
        }

        content = DOMQuery.createDocumentFragment(content);

        for (i = 1, length = this.length; i < length; i++) {
            // clone the content for multiple targets
            this[i].appendChild(content.cloneNode(true));
        }

        // append the original content to the first target
        this[0].appendChild(content);

        return this;
    }

    /**
     * Insert content into a DOMQuery
     *
     * @param   {QueryInput} content The content to insert
     * @returns {DOMQuery}   The DOMQuery
     */
    insert (content) {

        // if content is an html string, innerHTML has best performance
        if (typeof content === "string" && DOMQuery.isHTML(content)) {

            for (var i = this.length; i--; this[i].innerHTML = content);

            return this;
        }

        return this.empty().append(content);
    }

    /**
     * Remove a DOMQuery from the DOM
     *
     * @returns {DOMQuery}
     */
    remove () {

        for (let i = this.length; i--;) {

            let node = this[i];

            if (node instanceof Node) {

                node.parentNode.removeChild(node);
            }
        }

        return this;
    }

    /**
     * Empty a DOMQuery
     *
     * @returns {DOMQuery}
     */
    empty () {

        for (let i = this.length; i--;) {

            let node = this[i];

            if (node instanceof Element) {

                node.innerHTML = '';
            }
            else if (node instanceof Node) {

                while (node.lastChild) {

                    node.removeChild(node.lastChild);
                }
            }
        }

        return this;
    }

    /**
     * Add an event listener to an element
     *
     * @param {string} event
     * @param {function} listener
     * @param {boolean} [useCapture=false]
     * @returns {DOMQuery}
     */
    on (event, listener, useCapture = false) {

        for (let i = this.length; i--; this[i].addEventListener(event, listener, useCapture));

        return this;
    }

    /**
     * Remove an event listener from an element
     *
     * @param {string} event
     * @param {function} listener
     * @param {boolean} [useCapture=false]
     * @returns {DOMQuery}
     */
    off (event, listener, useCapture = false) {

        for (let i = this.length; i--; this[i].removeEventListener(event, listener, useCapture));

        return this;
    }

    /**
     * Query the DOM
     *
     * @param {string} selector
     * @param {Element} context
     * @returns {DOMQuery}
     */
    static query (selector, context) {

        var i, length, result = [];

        context = context || document.documentElement;

        if (context instanceof NodeList || context instanceof Array) {

            for (i = 0, length = context.length; i < length; i++) {

                // TODO: fix concat
                result = result.concat(this.query(selector, context[i]));
            }
        }
        else {

            if (context.querySelectorAll) {

                result = context.querySelectorAll(selector);
            }
        }

        return new this(result);
    }

    /**
     * Parse an HTML string into DOM nodes
     *
     * @param {string} html
     * @returns {DOMQuery}
     */
    static parse (html) {

        return new this(this.createDocumentFragment(html));
    }

    /**
     * Check if a string is an HTML string
     *
     * @param {string} html
     * @returns {boolean}
     */
    static isHTML (html) {

        html = html.trim();

        return (html[0] === "<" && html[html.length - 1] === ">" && html.length > 2);
    }

    /**
     * Convert an HTML string or DOM section into a DocumentFragment
     *
     * @static
     * @param {QueryInput} html
     * @returns {DocumentFragment}
     */
    static createDocumentFragment (html) {

        var fragment = document.createDocumentFragment(),
            helper,
            length,
            i;

        if (typeof html === 'string') {

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

                html = new DOMQuery(html);

                for (i = 0, length = html.length; i < length; fragment.appendChild(html[i++]));
            }
        }

        return fragment;
    }
}

export default DOMQuery;
