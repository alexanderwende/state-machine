class Event {

    constructor (options) {

        this.type = options.type;
        this.data = options.data;
        this.target = options.target;

        this.isCancelled = options.isCancelled || false;
    }

    cancel () {

        this.isCancelled = true;
    }
}

export default Event;
