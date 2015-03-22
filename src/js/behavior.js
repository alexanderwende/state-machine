import dom from './doms';

class Behavior {
    
    constructor (options) {
        
        this.host = options.host;
        this.element = options.element;
        this.listener = options.listener;
        this.event = options.event;
    }
    
    bind () {
        
        this.element.on(this.event, this.listener);
    }
    
    unbind () {
        
        this.element.off(this.event, this.listeners);
    }
}

export default Behavior;