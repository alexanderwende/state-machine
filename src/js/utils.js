
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

export {clone, extend, toArray};