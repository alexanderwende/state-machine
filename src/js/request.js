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

            let search = this.search.split('&');

            for (let i = 0, length = search.length; i < length; i++) {

                search[i] = search[i].split('=');

                let param = search[i][0];
                let value = search[i][1] !== undefined ? search[i][1] : true;

                if (this.params[param]) {

                    if (this.params[param] instanceof Array) {

                        this.params[param].push(value);
                    }
                    else {

                        this.params[param] = [this.params[param], value];
                    }
                }
                else {

                    this.params[param] = value;
                }
            }
        }
    }
}



export default Request;
