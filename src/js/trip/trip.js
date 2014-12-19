import Module from '../module';
import StateMachine from '../state-machine';
import TripService from './services/trip-service';
import TripListView from './views/trip-list-view';
import TripItemView from './views/trip-item-view';

class Trip extends Module {

    constructor (options) {

        super(options);

        this.state = new StateMachine();

        this.state.addState({
            id: 'list',
            route: '/list',
            enter: function (params, done) {

                this.listView = new TripListView({
                    element: this.element,
                    selector: this.selector,
                    module: this,
                    scope: {
                        items: this.trips
                    }
                });

                this.listView.render();

                return done();

            }.bind(this),
            exit: function (done) {
                return done();
            }
        });

        this.state.addState({
            id: 'details',
            route: '/details/:id',
            enter: function (params, done) {

                TripService.get(params.id).then(function (trip) {

                    this.itemView = new TripItemView({
                        element: this.element,
                        selector: this.selector,
                        module: this,
                        scope: {
                            item: trip
                        }
                    });

                    this.itemView.render();

                    return done();

                }.bind(this));

            }.bind(this),
            exit: function (done) {
                return done();
            }
        });
    }

    initialize (trips) {

        this.trips = trips;

        this.state.transition('list');
    }

    handleError (error) {

        console.error(error);
    }

    onStart (callback) {

        var onSuccess = function (trips) {
            this.initialize(trips);
            super.onStart(callback);
        }.bind(this);

        var onError = function (error) {
            this.handleError(error);
            super.onStart(callback);
        }.bind(this);

        TripService.getTrips().then(onSuccess, onError);
    }
}

export default Trip;
