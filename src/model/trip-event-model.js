// import { tripEvents } from '../mock/trip-events-mock.js';
// import { offers } from '../mock/trip-offers-mock.js';
// import { destionations } from '../mock/trip-destinations-mock.js';
import { DateFormats, SortTypes, UpdateType } from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import Observable from '../framework/observable.js';
import { formatDuration } from '../utils.js';

const {TIME, DATE_MONTH} = DateFormats;

dayjs.extend(duration);

export default class TripEventModel extends Observable {
  #offers = [];
  #destinations = [];
  #tripEvents = [];
  #sortTypes = [];

  #tripApiService = [];

  constructor({ tripApiService }) {
    super();

    this.#tripApiService = tripApiService;

    // this.#offers = this.offers;
    // this.#destinations = this.destinations;
    // this.#tripEvents = this.events;
    this.#sortTypes = Object.values(SortTypes);
  }

  async init() {
    try {
      const tripEvents = await this.#tripApiService.points;
      this.#tripEvents = tripEvents.map(this.#adaptToClient);
      this.#offers = await this.#tripApiService.offers;
      this.#destinations = await this.#tripApiService.destinations;
    } catch(err) {
      this.#destinations = [];
      this.#offers = [];
      this.#tripEvents = [];
    }

    this._notify(UpdateType.INIT);
  }

  get events() {
    const tripEvents = this.#tripApiService.points;
    this.#tripEvents = tripEvents.map(this.#adaptToClient);

    return this.#tripEvents.map((tripEvent) => {
      const eventDuration = dayjs.duration(dayjs(tripEvent.dateTo).diff(dayjs(tripEvent.dateFrom)));
      const destination = this.#destinations.find((_destination) => _destination.id === tripEvent.destination);

      return {
        id: tripEvent.id,
        eventDate: dayjs(tripEvent.dateFrom).format(DATE_MONTH),
        type: tripEvent.type,
        destination: destination,
        eventSchedule: {
          dateFrom: dayjs(tripEvent.dateFrom).format(TIME),
          dateTo: dayjs(tripEvent.dateTo).format(TIME),
          eventDuration: formatDuration(eventDuration),
        },
        durationInMinutes: eventDuration.asMinutes(),
        offers: tripEvent.offers,
        basePrice: tripEvent.base_price,
        isFavorite: tripEvent.is_favorite,
      };
    });
  }

  async updateEvent(updateType, update) {
    const index = this.#tripEvents.findIndex((tripEvent) => tripEvent.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting Event');
    }
    try {
      const response = await this.#tripApiService.updateWaypoint(update);
      const updatedEventsElement = this.#adaptToClient(response);

      this.#tripEvents = [
        ...this.#tripEvents.slice(0, index),
        updatedEventsElement,
        ...this.#tripEvents.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update event element');
    }
  }

  async addEvent(updateType, update) {
    try {
      const response = await this.#tripApiService.addPoint(update);
      const newEventsElement = this.#adaptToClient(response);

      this.tripEvents = [
        newEventsElement,
        ...this.tripEvents,
      ];

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t add list element');
    }
  }

  async deleteEvent(updateType, update) {
    const index = this.#tripEvents.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    try {
      await this.#tripApiService.deletePoint(update);
      this.#tripEvents = [
        ...this.#tripEvents.slice(0, index),
        ...this.#tripEvents.slice(index + 1),
      ];

      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete event element');
    }
  }

  get offers() {
    return this.#tripApiService.offers;
  }

  get destinations() {
    return this.#tripApiService.destinations;
  }

  get sortTypes() {
    return this.#sortTypes;
  }

  get allCities() {
    return this.#destinations.map((destination) => destination.name);
  }

  #adaptToClient(tripEvent) {
    const adaptedWaypoint = {
      ...tripEvent,
      basePrice: tripEvent['base_price'],
      dateFrom: new Date(tripEvent['date_from']),
      dateTo: new Date(tripEvent['date_to']),
      isFavorite: tripEvent['is_favorite']
    };

    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['date_to'];
    delete adaptedWaypoint['is_favorite'];

    return adaptedWaypoint;
  }
}
