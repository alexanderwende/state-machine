import Module from '../module';
import TripService from './services/trip-service';

class Trip extends Module {

    start () {

        super();

        TripService.getTrips()
            .then(function (trips) {
                this.trips = trips;
                console.log(this.trips);
            }.bind(this))
            .catch(function (error) {
                console.error(error);
            }.bind(this));
    }
}

export default Trip;
