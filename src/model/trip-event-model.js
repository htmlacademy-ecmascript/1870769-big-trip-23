import { tripEvents } from '../mock/trip-events-mock.js';
import { offers } from '../mock/trip-offers-mock.js';
import { destionations } from '../mock/trip-destinations-mock.js';
import { DateFormats, Filters, SORT_TYPES } from '../const.js';
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
  #offers = [];
  #destinations = [];
  tripEvents = [];
  #filters = [];
  #sortTypes = [];

  constructor() {
    this.#offers = this.offers;
    this.#destinations = this.destinations;
    this.tripEvents = this.events;
    this.#filters = Object.values(Filters);
    this.#sortTypes = SORT_TYPES;
  }

  get events() {
    // TODO: заменить на запрос к серверу
    return tripEvents.map((tripEvent) => {
      const eventDuration = dayjs.duration(dayjs(tripEvent.date_to).diff(dayjs(tripEvent.date_from)));
      const destination = this.#destinations.find((_destination) => _destination.id === tripEvent.destination);

      const eventOffers = tripEvent.offers.map((offerId) => {
        const offer = this.#offers.find((_offer) => _offer.id === offerId);
        return {
          offerTitle: offer.title,
          offerPrice: offer.price,
        };
      });

      return {
        id: tripEvent.id,
        eventDate: dayjs(tripEvent.date_from).format(DATE_MONTH),
        type: tripEvent.type,
        eventTitle: {
          destination: destination,
          eventCity: destination.name
        },
        eventSchedule: {
          dateFrom: dayjs(tripEvent.date_from).format(TIME),
          dateTo: dayjs(tripEvent.date_to).format(TIME),
          eventDuration: formatDuration(eventDuration),
        },
        offers: eventOffers,
        basePrice: tripEvent.base_price,
        isFavorite: tripEvent.is_favorite,
      };
    });
  }

  // TODO: заменить на запрос к серверу
  get offers() {
    return offers;
  }

  // TODO: заменить на запрос к серверу
  get destinations() {
    return destionations;
  }

  get filters() {
    return this.#filters;
  }

  get sortTypes() {
    return this.#sortTypes;
  }
}
