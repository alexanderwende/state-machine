import * as Utils from './utils';
import Request from './request';

/**
 * @class Route
 */
class Route {

    /**
     * @constructs Route
     *
     * @param {Object} [options={}] An object containing options
     */
    constructor (options = {}) {

        var param;

        this.id = options.id || options.path;

        this.path = options.path;

        this.handler = options.handler;

        this.params = [];

        // extract all parameter names from the route's path
        while ((param = Route.Matchers.Param.exec(this.path))) {
            this.params.push(param[1]);
        }

        // convert the path into a regular expression
        this.regexp = new RegExp('^' + this.path.replace(Route.Matchers.Param, '([^\/]+)') + '$', 'gi');
    }

    /**
     * Match a route againt a request
     *
     * @param {string|Request} request      A hash fragment or a Request instance
     * @returns {boolean}                   True if the path segment of the hash matches the route
     */
    match (request) {

        if (typeof request === 'string') {
            request = new Request(request);
        }

        this.reset();

        return this.regexp.test(request.path);
    }

    /**
     * Parse a route against a request and extract the route params
     *
     * @param {string|Request} request      A hash fragment or a Request instance
     * @returns {object}                    An object containing the extracted route parameters
     */
    parse (request) {

        var matches;

        if (typeof request === 'string') {
            request = new Request(request);
        }

        this.reset();

        if ((matches = this.regexp.exec(request.path))) {

            for (let i = 0, length = this.params.length; i < length; i++) {

                request.params[this.params[i]] = matches[i + 1];
            }
        }

        return request.params;
    }

    /**
     * Execute a route
     *
     * @param {object} params       An object containing the parameters for the route handler
     * @param {object} query        An object containing the query parameters
     */
    execute (params, query) {

        if (typeof this.handler === 'function') {

            this.handler(params, query);
        }
    }

    /**
     * Reset a route
     *
     * This method resets the route's regexp to always match from the beginning.
     */
    reset () {

        this.regexp.lastIndex = 0;
    }

    /**
     * Create a hash from a route
     *
     * @param {object} params       The route params to encode into the hash
     * @param {object} query        The query params to encode into the hash
     * @returns {string}            The created hash
     */
    toHash (params, query) {

        var path = this.path, search, param;

        this.reset();

        while (params && (param = Route.Matchers.Param.exec(path))) {
            // replace the match with the serialized value of the route parameter with the matched name
            path = path.replace(param[0], Utils.serialize(params[param[1]], 'urlencoded'));
            // after each replacement the hash string changes in length, so we have to reset the regexp
            this.reset();
        }

        search = Utils.serialize(query, 'urlencoded');

        return path + (search ? '?' + search : '');
    }
}

/**
 * @static
 * @type {Object.<String, RegExp>}
 */
Route.Matchers = {

    Param: /:([\w]+)/gi
};



export default Route;
