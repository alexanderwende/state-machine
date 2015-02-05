import Request from './request';
import Route from './route';

class Router {

    constructor (options) {

        this.routes = {};

        this.isStarted = false;

        this._onHashChange = function (event) {
            // get the new url from the hashchange event
            var match = event.newURL.match(/#(.+)$/);
            // and extract the hash fragment
            var hash = match && match[1] || '';
            // update the router instance to the new hash
            console.log(hash);
        }.bind(this);

        if (options) {

            for (let id in options.routes) {

                options.routes[id].id = id;

                this.route(options.routes[id]);
            }
        }
    }

    /**
     * Add or retrieve a route
     *
     * @param {string|object|Route}
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

    navigate (route, options = {}) {

        if (route in this.routes) {

            this.routes[route].execute(options.params);
        }
        else {

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

    static getFragment () {

        return window.top.location.hash.substr(1);
    }

    static setFragment (fragment, replace = false) {

        if (replace) {

            window.top.location.replace(window.top.location.href.replace(/#.*$/, '#' + fragment));
        }
        else {

            window.top.location.hash = fragment;
        }
    }
}



export default Router;
