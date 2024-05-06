import { tripEvents } from '../mock/trip-events-mock.js';
import { offers } from '../mock/trip-offers-mock.js';
import { destionations } from '../mock/trip-destinations-mock.js';
import { DateFormats } from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

const {TIME, DATE_MONTH} = DateFormats;

dayjs.extend(duration);

const formatDuration = (stopDuration) => {
  const days = stopDuration.days();
  const hours = stopDuration.hours();
  const minutes = stopDuration.minutes();

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  } else {
    return `${minutes}M`;
  }
};

export class TripEventModel {
  tripEvents = [];
  offers = [];
  destinations = [];

  constructor() {
    this.offers = this.fetchOffers();
    this.destinations = this.fetchDestinations();
    this.tripEvents = this.fetchTripEvents();
  }

  fetchTripEvents() {
    // TODO: заменить на запрос к серверу
    return tripEvents.map((tripEvent) => {
      const eventDuration = dayjs.duration(dayjs(tripEvent.date_to).diff(dayjs(tripEvent.date_from)));
      const offer = this.offers.find((_offer) => _offer.id === tripEvent.offers[0]);
      const destination = this.destinations.find((_destination) => _destination.id === tripEvent.destination);

      return {
        id: tripEvent.id,
        eventDate: dayjs(tripEvent.date_from).format(DATE_MONTH),
        type: tripEvent.type,
        eventTitle: {
          destination: tripEvent.type,
          eventCity: destination.name
        },
        eventSchedule: {
          dateFrom: dayjs(tripEvent.date_from).format(TIME),
          dateTo: dayjs(tripEvent.date_to).format(TIME),
          eventDuration: formatDuration(eventDuration),
        },
        offers: {
          offerTitle: offer.title,
          offerPrice: offer.price,
        },
        basePrice: tripEvent.base_price,
        isFavorite: tripEvent.is_favorite,
      };
    });
  }

  // TODO: заменить на запрос к серверу
  fetchOffers() {
    return offers;
  }

  // TODO: заменить на запрос к серверу
  fetchDestinations(){
    return destionations;
  }
}
