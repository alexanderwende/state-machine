import Module from '../module';
import TripService from './services/trip-service';
import TripListView from './views/trip-list-view';

class Trip extends Module {

    initialize (trips) {

        this.trips = trips;

        this.listView = new TripListView({
            element: this.element,
            selector: this.selector,
            scope: {
                items: this.trips
            }
        });

        this.listView.render();
    }

    handleError (error) {

        console.error(error);
    }

    start () {

        super();

        TripService.getTrips()
            .then(this.initialize.bind(this))
            .catch(this.handleError.bind(this));
    }
}

export default Trip;
