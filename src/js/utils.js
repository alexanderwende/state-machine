/**
 * @param {*} source            A source object to clone
 * @param {boolean} [deep]      Deep cloning of object
 * @returns {*}                 The cloned object
 */
function clone (source, deep) {

    if (typeof source === 'object') {

        // typeof null is 'object', so handle it
        if (source === null) {
            return null;
        }
        else if (source.constructor === Object) {
            return extend({}, source, deep);
        }
        else if (source.constructor === Array) {
            return extend([], source, deep);
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
}

/**
 * @param {*} target            A target object to extend
 * @param {*} source            A source object to extend from
 * @param {boolean} [deep]      Deep extending of object
 * @returns {*}                 The extended target object
 */
function extend (target, source, deep) {

    for (let property in source) {

        if (source.hasOwnProperty(property)) {

            let value = source[property];

            if (deep) {

                if (typeof value === 'object') {

                    if (value.constructor === Object) {

                        value = extend(target[property] || {}, value, deep);
                    }
                    else if (value.constructor === Array) {

                        value = extend(target[property] || [], value, deep);
                    }
                }
            }

            target[property] = value;
        }
    }

    return target;
}

function toArray (source) {

    var i, result = [];

    for (i = result.length = source.length; i--; result[i] = source[i]);

    return result;
}

var Parser = {

    parse: function (string, format) {

        return this.formats[format](string);
    },

    formats: {

        urlencoded: function (string) {

            var result = {}, search = string.split('&');

            for (let i = 0, length = search.length; i < length; i++) {

                search[i] = search[i].split('=');

                let param = decodeURIComponent(search[i][0]);
                let value = search[i][1] !== undefined ? decodeURIComponent(search[i][1]) : true;

                if (result[param]) {

                    if (result[param] instanceof Array) {

                        result[param].push(value);
                    }
                    else {

                        result[param] = [result[param], value];
                    }
                }
                else {

                    result[param] = value;
                }
            }

            return result;
        }
    }
};

var Serializer = {

    serialize: function (data, format) {

        return this.formats[format](data);
    },

    formats: {

//        urlencoded: function (data) {
//
//
//            var result = '';
//
//            if (data) {
//
//                if (data.constructor === Object) {
//
//                    for (let param in data) {
//
//                        let value = data[param];
//
//                        let name = encodeURIComponent(param);
//
//                        if (value !== undefined) {
//
//                            // TODO: finish this!
//                        }
//                    }
//                }
//                else if (data.constructor === Array) {
//
//
//                }
//            }
//
//            return result;
//        },

        urlencoded: function (data) {

            /**
             * A nested, recursive serialization method to create name-value pairs
             *
             * @param {*} value
             * @param {string} [name]
             * @returns {string}
             */
            function serialize (value, name) {

                var serialization = '', i, length;

                // undefined values should not appear in the serialization
                if (value === undefined) {
                    serialization = '';
                }
                // null values should be serialized to empty strings
                else if (value === null) {
                    serialization = name ? encodeURIComponent(name) + '=' : '';
                }
                // primitive types can just be stringified
                else if (typeof value !== "object") {
                    serialization = (name ? encodeURIComponent(name) + '=' : '') + encodeURIComponent(value.toString());
                }
                else {
                    // for native types use toString()
                    if (value instanceof Boolean ||
                        value instanceof Number ||
                        value instanceof String ||
                        value instanceof RegExp) {

                        serialization = (name ? encodeURIComponent(name) + '=' : '') + encodeURIComponent(value.toString());
                    }
                    // for dates use toUTCString()
                    else if (value instanceof Date) {
                        serialization = (name ? encodeURIComponent(name) + '=' : '') + encodeURIComponent(value.toISOString());
                    }
                    // recursively serialize arrays with brackets notation
                    else if (value instanceof Array) {
                        for (i = 0, length = value.length; i < length; i++) {
                            serialization += (serialization ? '&' : '') + serialize(value[i], name ? name + '[]' : '[]');
                        }
                    }
                    // recursively serialize objects, using the keys as name in the nested serialization step
                    else {
                        for (i in value) {
                            if (value.hasOwnProperty(i)) {
                                serialization += (serialization ? '&' : '') + serialize(value[i], name ? name + '[' + i + ']' : i);
                            }
                        }
                    }
                }

                return serialization;
            }

            return serialize(data);
        },

        /**
         * Serialize a data object into a JSON-encoded string
         *
         * @param {*} data
         * @returns {string}
         */
        json: function (data) {

            return JSON.stringify(data);
        }
    }
};


export {clone, extend, toArray, Parser, Serializer};
