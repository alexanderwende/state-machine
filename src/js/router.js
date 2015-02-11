import * as Utils from './utils';
import Request from './request';
import Route from './route';

class Router {

    constructor (options) {

        this.routes = {};

        this.current = null;
        this.default = options.default || null;

        this.currentHash = null;

        this.isStarted = false;

        this._onHashChange = this.onHashChange.bind(this);

        if (options) {

            for (let id in options.routes) {

                options.routes[id].id = id;

                this.route(options.routes[id]);
            }
        }
    }

    onHashChange (event) {

        // get the new url from the hashchange event
        var match = event.newURL.match(/#(.+)$/);

        // extract the hash fragment
        var hash = match && match[1] || '';

        // update the router instance to the new hash
        this.navigate(hash, {trigger: true});
    }

    /**
     * Add or retrieve a route
     *
     * @param {string|object|Route} route
     * @returns {Route|Router}
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
     * @param {string|Request} route
     * @param {object} options
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

    start () {

        if (this.isStarted) { return; }

        if ('onhashchange' in window) {
            window.addEventListener('hashchange', this._onHashChange);
        }

        this.isStarted = true;
    }

    stop () {

        if (!this.isStarted) { return; }

        if ('onhashchange' in window) {
            window.removeEventListener('hashchange', this._onHashChange);
        }

        this.isStarted = false;
    }

    static getHash () {

        return window.top.location.hash.substr(1);
    }

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
