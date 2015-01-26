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

    match (fragment) {

        this.reset();

        return this.regexp.test(fragment);
    }

    parse (fragment) {

        var params = {};

        this.reset();

        var matches = this.regexp.exec(fragment);

        if (matches) {

            for (let i = 0, length = this.params.length; i < length; i++) {

                params[this.params[i]] = matches[i + 1];
            }

            return params;
        }

        return undefined;
    }

    execute (fragment) {

        var params;
        var match;

        if (typeof fragment === 'string') {

            params = this.parse(fragment);
            match = params !== undefined;
        }
        else {

            params = fragment;
            match = true;
        }

        if (match) {

            if (typeof this.handler === 'function') {

                this.handler(params);
            }
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
}

Route.Matchers = {

    Param: /:([\w]+)/gi
}

export default Route;
