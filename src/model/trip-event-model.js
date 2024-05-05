import { createTripEventsMock } from '../mock/trip-events-mock';

export class TripEventModel {
  tripEvents = [];

  constructor () {
    for (let i = 0; i < 3; i++) {
      this.tripEvents.push(createTripEventsMock());
    }
  }
}
