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

        urlencoded: function (data) {

            var result = '';

            if (typeof data !== 'object') {

                result = encodeURIComponent(data);
            }
            else {

                for (let param in data) {

                    result += (result ? '&' : '') + encodeURIComponent(param) + ((data[param] !== undefined) ? '=' + encodeURIComponent(data[param]) : '');
                }
            }

            return result;
        }
    }
};


export {clone, extend, toArray, Parser, Serializer};
