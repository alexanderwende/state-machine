import StateMachine from './state-machine';

class Router extends StateMachine {

    constructor (options) {

        super(options);

        this._onHashChange = function (event) {
            // get the new url from the hashchange event
            var match = event.newURL.match(/#(.+)$/);
            // and extract the hash fragment
            var hash = match && match[1] || '';
            // update the router instance to the new hash
            console.log(hash);
        }.bind(this);
    }

    addRoute (route) {}

    removeRoute (route) {}

    navigate (url, trigger) {}

    start () {

        if (this.isStarted) { return; }

        if (window.onhashchange) {
            window.addEventListener('hashchange', this._onHashChange);
        }
    }

    stop () {

        if (!this.isStarted) { return; }

        if (window.onhashchange) {
            window.removeEventListener('hashchange', this._onHashChange);
        }
    }
}

export default Router;
