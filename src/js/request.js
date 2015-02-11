import * as Utils from './utils';

class Request {

    constructor (hash) {

        this.hash = hash;
        this.path = '';
        this.search = '';

        this.params = {};
        this.query = {};

        this.parse();
    }

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
