/**
 * @class Serializer
 * @static
 * @interface
 */
var Serializer = {

    /**
     * Serialize an object
     *
     * @param {*} data
     * @param {string} serializer
     * @returns {string}
     */
    serialize: function (data, serializer) {

        if (!this.serializers[serializer]) {
            throw new ReferenceError("Serializer has no serializer method '" + serializer + "'");
        }

        return this.serializers[serializer](data);
    },

    /**
     * Add a serialization method
     *
     * @param {string} name
     * @param {function(*): string} method
     */
    add: function (name, method) {

        this.serializers[name] = method;
    },

    /**
     * The serializer method store
     *
     * @type {Object.<string, function(*): string>}
     */
    serializers: {

        /**
         * Serialize a data object into a url-encoded string
         *
         * @param {*} data
         * @returns {string}
         */
        'urlencoded': function (data) {

            /**
             * A nested, recursive serialization method to create name-value pairs
             *
             * @param {*} value
             * @param {string} [name]
             * @returns {string}
             */
            function serialize (value, name = '') {

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
                    // recursively serialize objects, using the keys as name in the nested serialization step
                    if (value.constructor === Object) {

                        for (let i in value) {

                            serialization += (serialization ? '&' : '') + serialize(value[i], name ? name + '[' + i + ']' : i);
                        }
                    }
                    // recursively serialize arrays with brackets notation
                    else if (value.constructor === Array) {

                        for (let i = 0, length = value.length; i < length; i++) {

                            serialization += (serialization ? '&' : '') + serialize(value[i], name + '[]');
                        }
                    }
                    else {
                        // for dates use toUTCString()
                        if (value instanceof Date) {

                            serialization = (name ? encodeURIComponent(name) + '=' : '') + encodeURIComponent(value.toISOString());
                        }
                        // for native and custom types use toString()
                        else {

                            serialization = (name ? encodeURIComponent(name) + '=' : '') + encodeURIComponent(value.toString());
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
        'json': function (data) {

            return JSON.stringify(data);
        }
    }
};

export default Serializer;
