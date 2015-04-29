
var UtilityService = {

    name: 'utils',

    each: function (list, iterator, context = null) {

        if (list instanceof Array) {

            for (let i = 0, l = list.length; i < l; i++) {

                iterator.call(context, list[i], i, list);
            }
        }
        else if (typeof list === 'object') {

            let keys = Object.keys(list);

            for (let i = 0, l = keys.length; i < l; i++) {

                iterator.call(context, list[keys[i]], keys[i], list);
            }
        }
    },

    extend: function (target, source, deep = false) {

        if (arguments.length > 2 && typeof deep !== 'boolean') {

            let sources = [];

            for (let i = 1, length = arguments.length; i < length; sources[i - 1] = arguments[i++]);

            if (typeof sources[sources.length - 1] === 'boolean') {

                deep = sources.pop();
            }
            else {

                deep = false;
            }

            source = sources.pop();

            // we extend all sources from right to left
            while (sources.length) {

                source = this.extend(sources.pop(), source, deep);
            }
        }

        for (let property in source) {

            if (source.hasOwnProperty(property)) {

                let value = source[property];

                if (deep) {

                    if (typeof value === 'object') {

                        if (value.constructor === Object) {

                            value = this.extend(target[property] || {}, value, deep);
                        }
                        else if (value.constructor === Array) {

                            value = this.extend(target[property] || [], value, deep);
                        }
                    }
                }

                target[property] = value;
            }
        }

        return target;
    },

    clone: function (source, deep = false) {

        if (typeof source === 'object') {

            // typeof null is 'object', so handle it
            if (source === null) {
                return null;
            }
            else if (source.constructor === Object) {
                return this.extend({}, source, deep);
            }
            else if (source.constructor === Array) {
                return this.extend([], source, deep);
            }
            // for native types we can use a copy-constructor which
            // uses object.valueOf() to resolve the object value
            else {
                return new source.constructor(source);
            }
        }

        // for non-object types return a simple copy,
        // in case of functions return the reference,
        // in case of undefined return undefined
        return source;
    },

    capitalize: function (string) {

        return string && string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
    }
};

export default UtilityService;
