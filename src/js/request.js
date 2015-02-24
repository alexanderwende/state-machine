import * as Utils from './utils';

/**
 * @class Request
 */
class Request {

    /**
     * @constructs Request
     *
     * @param {String} hash The hash representing the request
     */
    constructor (hash) {

        this.hash = hash;
        this.path = '';
        this.search = '';

        this.params = {};
        this.query = {};

        this.parse();
    }

    /**
     * Parse a request to extract search parameters
     */
    parse () {

        var segments = this.hash.split('?');

        this.path = segments[0];
        this.search = segments[1];

        if (this.search) {

            this.query = Utils.parse(this.search, 'urlencoded');
        }
    }
}



export default Request;
