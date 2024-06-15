import { tripEvents } from '../mock/trip-events-mock.js';
import { offers } from '../mock/trip-offers-mock.js';
import { destionations } from '../mock/trip-destinations-mock.js';
import { DateFormats, Filters, SortTypes } from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import Observable from '../framework/observable.js';

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

export class TripEventModel extends Observable {
  #offers = [];
  #destinations = [];
  tripEvents = [];
  #filters = [];
  #sortTypes = [];

  constructor() {
    super();

    this.#offers = this.offers;
    this.#destinations = this.destinations;
    this.tripEvents = this.events;
    this.#filters = Object.values(Filters);
    this.#sortTypes = Object.values(SortTypes);
  }

  get events() {
    // TODO: заменить на запрос к серверу
    return tripEvents.map((tripEvent) => {
      const eventDuration = dayjs.duration(dayjs(tripEvent.date_to).diff(dayjs(tripEvent.date_from)));
      const destination = this.#destinations.find((_destination) => _destination.id === tripEvent.destination);

      return {
        id: tripEvent.id,
        eventDate: dayjs(tripEvent.date_from).format(DATE_MONTH),
        type: tripEvent.type,
        destination: destination,
        eventSchedule: {
          dateFrom: dayjs(tripEvent.date_from).format(TIME),
          dateTo: dayjs(tripEvent.date_to).format(TIME),
          eventDuration: formatDuration(eventDuration),
        },
        durationInMinutes: eventDuration.asMinutes(),
        offers: tripEvent.offers,
        basePrice: tripEvent.base_price,
        isFavorite: tripEvent.is_favorite,
      };
    });
  }

  updateEvent(updateType, update) {
    const index = this.tripEvents.findIndex((tripEvent) => tripEvent.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting Event');
    }

    this.tripEvents = [
      ...this.tripEvents.slice(0, index),
      update,
      ...this.tripEvents.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this.tripEvents = [
      update,
      ...this.tripEvents,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this.tripEvents.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this.tripEvents = [
      ...this.tripEvents.slice(0, index),
      ...this.tripEvents.slice(index + 1),
    ];

    this._notify(updateType);
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

  get allCities() {
    return this.#destinations.map((destination) => destination.name);
  }
}
