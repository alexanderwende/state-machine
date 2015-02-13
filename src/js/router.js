import Request from './request';
import Route from './route';

class Router {

    /**
     * @constructor
     *
     * @param {Object} [options={}]
     * @param {Object.<string, Object>} [options.routes]
     * @param {string} [options.default]
     */
    constructor (options = {}) {

        this.routes = {};

        this.default = options.default || null;
        this.current = null;

        this.currentHash = null;

        this.isStarted = false;

        this._onHashChange = this._handleHashChange.bind(this);

        if (options) {

            for (let id in options.routes) {

                options.routes[id].id = id;

                this.route(options.routes[id]);
            }
        }
    }

    /**
     * Handle hash change events
     *
     * @private
     * @param {Event} event
     */
    _handleHashChange (event) {

        var match = event.newURL.match(/#(.+)$/);

        var hash = match && match[1] || '';

        if (hash !== this.currentHash) {

            this.navigate(hash, {trigger: true});
        }
    }

    /**
     * Add or retrieve a route
     *
     * @param {(string|Object|Route)} route
     * @returns {(Route|Router)}
     */
    route (route) {

        switch (typeof route) {

            case 'object':

                if (!(route instanceof Route)) {

                    route = new Route(route);
                }

                this.routes[route.id] = route;

                break;

            case 'string':

                return this.routes[route];
        }

        return this;
    }

    /**
     * Activate a route
     * 
     * @param {(string|Request)} route
     * @param {Object} [options={}]
     * @param {Object} [options.params]
     * @param {Object} [options.query]
     * @param {boolean} [options.trigger]
     * @param {boolean} [options.replace]
     */
    navigate (route, options = {}) {
        
        var hash, request, params, query, match = false;

        console.log('Router.navigate()... route: %s, options: %o', route, options);

        if (route in this.routes) {
            
            route   = this.routes[route];
            params  = options.params;
            query   = options.query;
            hash    = route.toHash(params, query);
            match   = true;
        }
        else {

            if (typeof route === 'string') {
                
                request = new Request(route);
            }
            
            for (let i in this.routes) {
                
                if (this.routes[i].match(request)) {
                    
                    route   = this.routes[i];
                    params  = route.parse(request);
                    query   = request.query;
                    hash    = route.toHash(params, query);
                    match   = true;
                    break;
                }
            }
        }

        if (hash !== this.currentHash) {
            
            if (match) {

                this.currentHash = hash;
                this.current = route;

                Router.setHash(hash, options.replace);

                if (options.trigger) {

                    route.execute(params, query);
                }
            }
            else {

                if (this.default !== null) {

                    this.navigate(this.default, {trigger: options.trigger, replace: options.replace});
                }
            }
        }
    }

    /**
     * Start the router
     *
     * Starting the router will make the router listen to hash change events
     * and automatically trigger route execution for matched hashes.
     */
    start () {

        if (this.isStarted) { return; }

        if ('onhashchange' in window) {
            window.addEventListener('hashchange', this._onHashChange);
        }
        else {
            throw 'window.onhashchange not supported';
        }

        this.isStarted = true;

        // resolve the current hash
        this.navigate(Router.getHash(), {trigger: true});
    }

    /**
     * Stop the router
     *
     * Stopping the router will make the router stop listening to hash change events
     * and routes will not be executed automatically any longer.
     */
    stop () {

        if (!this.isStarted) { return; }

        if ('onhashchange' in window) {
            window.removeEventListener('hashchange', this._onHashChange);
        }
        else {
            throw 'window.onhashchange not supported';
        }

        this.isStarted = false;
    }

    /**
     * Get the current hash
     *
     * @static
     * @returns {string}
     */
    static getHash () {

        return window.top.location.hash.substr(1);
    }

    /**
     * Set a new hash
     *
     * @static
     * @param {string} hash
     * @param {boolean} [replace=false]
     */
    static setHash (hash, replace = false) {

        if (replace) {

            window.top.location.replace(window.top.location.href.replace(/#.*$/, '#' + hash));
        }
        else {

            window.top.location.hash = hash;
        }
    }
}

export default Router;
