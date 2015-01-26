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
    }

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
}

export default Router;
