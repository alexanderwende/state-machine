
function clone (source, deep) {

    if (typeof source === 'object') {

        if (deep) {

            if (source instanceof Object) {
                return extend({}, source, deep);
            }
            else if (source instanceof Array) {
                return extend([], source, deep);
            }
            else {
                return new source.constructor(source);
            }
        }
    }

    return source;
}

function extend (target, source, deep) {

    for (let property in source) {

        if (source.hasOwnProperty(property)) {

            target[property] = clone(source[property], deep);
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
