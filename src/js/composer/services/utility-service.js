
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
    }
};

export default UtilityService;
