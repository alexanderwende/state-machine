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

import * as utils from './utils';

class DOMQuery extends Array {

    /**
     * Create a new DOMQuery
     *
     * @constructor
     * @param {string|EventTarget|NodeList|Array} selector
     * @param {EventTarget|NodeList|Array} context
     * @returns {DOMQuery}
     */
    constructor (selector, context) {

        var i, result;

        if (typeof selector === 'string') {

            if (DOMQuery.isHTML(selector)) {

                return DOMQuery.parse(selector);
            }

            return DOMQuery.query(selector, context);
        }

        if (!(this instanceof DOMQuery)) {

            return new DOMQuery(selector, context);
        }

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
     * @param {string|EventTarget|NodeList|Array} selector
     * @returns {DOMQuery}
     */
    find (selector) {

        return DOMQquery(selector, this);
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

        if (typeof value === "undefined") {

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

                if (node.hasAttribute(attribute)) {

                    return true;
                }
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

    append (html) {}

    insert (html) {}

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

                nide.innerHTML = '';
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
     * @param {string} selector
     * @param {Element} context
     * @returns {DOMQuery}
     */
    static query (selector, context) {

        var i, length, result = [];

        context = context || document.documentElement;

        if (context instanceof NodeList || context instanceof Array) {

            for (i = 0, length = context.length; i < length; i++) {

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
     * @param {string} html
     * @returns {DOMQuery}
     */
    static parse (html) {

        var temp, result;

        temp = document.createElement('div');
        temp.innerHTML = html;

        result = new this(temp.childNodes);

        while(temp.lastChild) {
            temp.removeChild(temp.lastChild);
        }

        return result;
    }

    static isHTML (selector) {

        return (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length > 2);
    }
}

export default DOMQuery;
