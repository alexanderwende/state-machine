import * as Utils from './utils';
import Request from './request';
import Route from './route';

class Router {

    constructor (options) {

        this.routes = {};
        
        this.current = null;
        this.default = null;

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

        var params;

        if (typeof request === 'string') {
            request = new Request(request);
        }

        if (request instanceof Request) {

            params = Utils.extend(request.params, this.parse(request));
        }
        else {

            params = request;
        }


        // route can be a route id
        if (route in this.routes) {

            this.routes[route].execute(options.params);
        }
        else {

            // route can be a plain hash fragment or a Request instance
            if (typeof route === 'string') {
                route = new Request(route);
            }

            for (let i in this.routes) {

                if (this.routes[i].match(route)) {

                    this.routes[i].execute(route);
                }
            }
        }
    }
    
    navigate (route, options = {}) {
        
        var params, match = false;
        
        if (route in this.routes) {
            
            route = this.routes[route];
            params = options.params;
            match = true;
        }
        else {
            
            if (typeof route === 'string') {
                
                route = new Request(route);
            }
            
            for (let i in this.routes) {
                
                if (this.routes[i].match(route)) {
                    
                    match = true;
			        params = Utils.extend(route.params, this.routes[i].parse(route));
                    route = this.routes[i];
                    break;
                }
            }
        }

        if (match && options.trigger) {
            
            route.execute(params);
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

//    static getFragment () {
//
//        return window.top.location.hash.substr(1);
//    }
//
//    static setFragment (fragment, replace = false) {
//
//        if (replace) {
//
//            window.top.location.replace(window.top.location.href.replace(/#.*$/, '#' + fragment));
//        }
//        else {
//
//            window.top.location.hash = fragment;
//        }
//    }
}

export default Router;
