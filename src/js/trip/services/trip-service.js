var TripService = {

    _cache: new Map,

    getTrips: function (userId, callback) {

        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();

            xhr.open('GET', '/js/trip/data/trip-data.json');

            xhr.onload = function (event) {

                if (this.status === 200 || this.status === 304) {

                    var trips = JSON.parse(this.responseText).trips;

                    trips.forEach(function (trip) {
                        TripService._cache.set(trip.id, trip);
                    });

                    resolve(trips);
                }
                else {

                    reject(Error(this.statusText));
                }
            };

            xhr.onerror = function (event) {

                reject(Error('Network error.'));
            };


            xhr.send();
        });
    },

    get: function (tripId) {

        return new Promise(function (resolve, reject) {

            var trip = TripService._cache.get(tripId);

            if (trip) {
                resolve(trip);
            }
            else {
                reject(Error('No trip found for id ' + tripId));
            }
        });
    }
};

export default TripService;
