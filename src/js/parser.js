/**
 * @class Parser
 * @static
 * @interface
 */
var Parser = {

    /**
     * Parse a string
     *
     * @param {string} data
     * @param {string} parser
     * @returns {*}
     */
    parse: function (data, parser) {

        if (!this.Parsers[parser]) {
            throw new ReferenceError("Parser has no parser method '" + parser + "'");
        }

        return this.Parsers[parser](data);
    },

    /**
     * Add a parsing method
     *
     * @param {string} name
     * @param {function(string): *} method
     */
    addParser: function (name, method) {

        this.Parsers[name] = method;
    },

    /**
     * Check if a string represents a number
     *
     * @param {string} dataString
     * @returns {boolean}
     */
    isNumber: function (dataString) {

        // parseFloat() is surprisingly slow, also it will strip characters from the input string,
        // following RegExp performs over 40% better and returns false for strings like "12kg"
        // however allowing exponential notations like "1e-24", the non-capturing groups (?: )
        // perform slightly faster than capturing groups
        return (/^\d+(?:\.\d+)?(?:e-?\d+)?$/).test(dataString);
    },

    /**
     * Convert a string to a number
     *
     * @param {string} dataString
     * @returns {number}
     */
    toNumber: function (dataString) {

        return parseFloat(dataString);
    },

    /**
     * Check if a string represents a boolean
     *
     * @param {string} dataString
     * @returns {boolean}
     */
    isBoolean: function (dataString) {

        // the RegExp test is about 20% faster than a comparable implementation
        // with string comparison and toLowerCase()
        return (/^true$|^false$/i).test(dataString);
    },

    /**
     * Convert a string to a boolean
     *
     * @param {string} dataString
     * @returns {boolean}
     */
    toBoolean: function (dataString) {

        return (/^true$/i).test(dataString);
    },

    /**
     * Check if a string represents a date
     *
     * @param {string} dataString
     * @returns {boolean}
     */
    isDate: function (dataString) {

        // the RegExp tests a string against the ISO date format, so it matches if a date
        // was serialized with the toISOString() method, as in toJSON() e.g.,
        // and it is over 90% faster than a comparable implementation involving the construction
        // of a new Date instance and its serialization and comparison with the original string
        return (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/).test(dataString);
    },

    /**
     * Convert a string to a date
     *
     * @param {string} dataString
     * @returns {Date}
     */
    toDate: function (dataString) {

        return new Date(dataString);
    },

    /**
     * Check if a string represents a regexp
     *
     * @param {string} dataString
     * @returns {boolean}
     */
    isRegExp: function (dataString) {

        return (/^\/.*\/(?:g|i|m|y){0,4}$/).test(dataString);
    },

    /**
     * Convert a string to a regexp
     *
     * @param {string} dataString
     * @returns {RegExp}
     */
    toRegExp: function (dataString) {

        var matches = (/^\/(.*)\/(g|i|m|y){0,4}$/).exec(dataString);
        var pattern = matches[1];
        var flags = matches[2];

        return new RegExp(pattern, flags);
    },

    /**
     * The parser method store
     *
     * @type {Object.<string, function(string): *>}
     */
    Parsers: {

        /**
         * Parse a url-encoded string
         *
         * @param {string} dataString
         * @returns {*}
         */
        'urlencoded': function (dataString) {

            // if parameter string is empty return a null object
            if (!dataString) { return null; }

            // make sure to only look at the query string
            dataString = dataString.substr(dataString.indexOf('?') + 1);

            // split up the parameters
            var paramSegments = dataString.split('&');

            var params = {}, name, value, valueIndex;

            /**
             * A nested, recursive parsing method which allows to create deeply nested objects from strings
             *
             * @param {string} name
             * @param {*} value
             * @param {object} params
             */
            function parseValue (name, value, params) {

                var objectRegExp = /(.*?)\[(.+?)]/;
                var arrayRegExp = /(.*?)\[]/;
                var matches;

                // if the name matches an object regexp
                // matches[0] is the whole match
                // matches[1] is the object name
                // matches[2] is the key
                if ((matches = objectRegExp.exec(name))) {
                    if (!params[matches[1]]) {
                        params[matches[1]] = {};
                    }
                    // recursively parse the value into the nested object of the params object
                    // the name has to contain also the non-matched rest of the original name
                    // e.g. foo[bar][baz] --> will become --> bar[baz]
                    parseValue(matches[2] + name.substr(matches[0].length), value, params[matches[1]]);
                }
                // if the name matches an array regexp
                else if ((matches = arrayRegExp.exec(name))) {
                    if (!params[matches[1]]) {
                        params[matches[1]] = [];
                    }
                    // recursively parse the value into the same object (duplicate names create arrays)
                    parseValue(matches[1], value, params);
                }
                // if the params object already contains the name
                else if (params[name]) {
                    // and it's an array, just push the new value
                    if (params[name] instanceof Array) {
                        params[name].push(value);
                    }
                    // or create an array with the old and new value
                    else {
                        params[name] = [params[name], value];
                    }
                }
                // add the name-value pair to the params object
                else {
                    params[name] = value;
                }
            }

            for (var i = 0, length = paramSegments.length; i < length; i++) {

                valueIndex = paramSegments[i].indexOf('=');

                if(valueIndex > 0) {
                    name = decodeURIComponent(paramSegments[i].substring(0, valueIndex));
                    value = decodeURIComponent(paramSegments[i].substr(valueIndex + 1));

//                    if (Serializer.isBoolean(value)) {
//                        value = Serializer.toBoolean(value);
//                    }
//                    else if (Serializer.isNumber(value)) {
//                        value = Serializer.toNumber(value);
//                    }
//                    else if (Serializer.isDate(value)) {
//                        value = Serializer.toDate(value);
//                    }
//                    else if (Serializer.isRegExp(value)) {
//                        value = Serializer.toRegExp(value);
//                    }

                } else {
                    name = decodeURIComponent(paramSegments[i]);
                    value = true;
                }

                parseValue(name, value, params);
            }

            return params;
        },

        /**
         * Parse a JSON-encoded string
         *
         * @param {string} dataString
         * @returns {*}
         */
        'json': function (dataString) {

            return JSON.parse(dataString);
        }
    }
};

export default Parser;
