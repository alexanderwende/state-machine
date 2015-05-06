import Component from '../component';
import RenderBehavior from '../behaviors/render-behavior';
import DomBehavior from '../behaviors/dom-behavior';
import utils from '../services/utility-service';

class ViewComponent extends Component {

    onInit () {

        utils.each(this.domEvents, function (event, index) {

            // fix listeners...
            this.domEvents[index] = event;

        }, this);
    }

    getTemplate () {

        return this.template;
    }

    getData () {

        return this.data;
    }
}

ViewComponent.defaultOptions = Component.defaultOptions.extend({
    template: null,
    data: null,
    behaviors: [
        {
            behaviorClass: RenderBehavior
        },
        {
            behaviorClass: DomBehavior,
            behaviorOptions: function (host) {
                return {
                    domEvents: host.domEvents
                }
            }
        }
    ]
});

export default ViewComponent;
