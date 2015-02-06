import Parser from './utils';

class Request {

    constructor (hash) {

        this.hash = hash;
        this.path = '';
        this.search = '';
        this.params = {};

        this.parse();
    }

    parse () {

        var segments = this.hash.split('?');

        this.path = segments[0];
        this.search = segments[1];

        if (this.search) {

            this.params = Parser.parse(this.search, 'urlencoded');
        }
    }
}



export default Request;
