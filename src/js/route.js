import * as Utils from './utils';
import Request from './request';

class Route {

    constructor (options) {

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

        var params = {}, matches;

        if (typeof request === 'string') {
            request = new Request(request);
        }

        this.reset();

        if ((matches = this.regexp.exec(request.path))) {

            for (let i = 0, length = this.params.length; i < length; i++) {

                params[this.params[i]] = matches[i + 1];
            }
        }

        return params;
    }

    /**
     * Execute a route
     *
     * @param {object} params       An object containing the parameters for the route handler
     */
    execute (params) {
        
        if (typeof this.handler === 'function') {
            
            this.handler(params);
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

    toHash (params) {

        var path = this.path, search, param;

        params = Utils.clone(params);

        this.reset();

        while (params && (param = Route.Matchers.Param.exec(path))) {
            // replace the match with the serialized value of the route parameter with the matched name
            path = path.replace(param[0], Utils.Serializer.serialize(params[param[1]], 'urlencoded'));
            // remove the processed parameter from the parameter list
            delete params[param[1]];
            // after each replacement the hash string changes in length, so we have to reset the regexp
            this.reset();
        }

        search = Utils.Serializer.serialize(params, 'urlencoded');

        return path + (search ? '?' + search : '');
    }
}

Route.Matchers = {

    Param: /:([\w]+)/gi
}



export default Route;
