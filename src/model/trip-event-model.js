import { SortTypes, UpdateType } from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import Observable from '../framework/observable.js';

dayjs.extend(duration);

export default class TripEventModel extends Observable {
  /** @type {Array<TripOfferTyped>} */
  #offers = [];
  #destinations = [];
  /** @type {Array<TripEvent>} */
  #tripEvents = [];
  #sortTypes = [];

  /** @type {?import('../trip-api-service.js').default} */
  #tripApiService = null;

  /**
   * @param {{
   *  tripApiService: import('../trip-api-service.js').default
   * }} param
   */
  constructor({ tripApiService }) {
    super();

    this.#tripApiService = tripApiService;
    this.#sortTypes = Object.values(SortTypes);
  }

  async init() {
    if (!this.#tripApiService) {
      throw new Error('Can\'t init model without tripApiService');
    }

    try {
      this.#destinations = await this.#tripApiService.destinations;
      this.#offers = await this.#tripApiService.offers;
      const tripEvents = await this.#tripApiService.points;
      this.#tripEvents = tripEvents.map(this.#adaptToClient);
    } catch (err) {
      this.#destinations = [];
      this.#offers = [];
      this.#tripEvents = [];
    } finally {
      this._notify(UpdateType.INIT);
    }
  }

  /**
   * @returns {Array<TripEvent>}
   */
  get events() {
    return this.#tripEvents;
  }

  /**
   *
   * @param {*} updateType
   * @param {TripEvent} update
   */
  async updateEvent(updateType, update) {
    const index = this.#tripEvents.findIndex(
      (tripEvent) => tripEvent.id === update.id
    );

    if (index === -1) {
      throw new Error('Can\'t update unexisting Event');
    }

    if (!this.#tripApiService) {
      throw new Error('Can\'t init model without tripApiService');
    }

    try {
      const response = await this.#tripApiService.updatePoint({
        id: update.id,
        type: update.type,
        destination: update.destination,
        'date_from': update.dateFrom.toISOString(),
        'date_to': update.dateTo.toISOString(),
        'base_price': update.basePrice,
        'is_favorite': update.isFavorite,
        offers: update.offers.map((offer) => offer.id),
      });

      const updatedEventsElement = this.#adaptToClient(response);

      this.#tripEvents = [
        ...this.#tripEvents.slice(0, index),
        updatedEventsElement,
        ...this.#tripEvents.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t update event element');
    }
  }

  async addEvent(updateType, update) {
    if (!this.#tripApiService) {
      throw new Error('Can\'t init model without tripApiService');
    }

    try {
      const response = await this.#tripApiService.addPoint(update);
      const newEventsElement = this.#adaptToClient(response);

      this.tripEvents = [newEventsElement, ...this.tripEvents];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t add list element');
    }
  }

  async deleteEvent(updateType, update) {
    const index = this.#tripEvents.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    if (!this.#tripApiService) {
      throw new Error('Can\'t init model without tripApiService');
    }

    try {
      await this.#tripApiService.deletePoint(update);
      this.#tripEvents = [
        ...this.#tripEvents.slice(0, index),
        ...this.#tripEvents.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete event element');
    }
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  get sortTypes() {
    return this.#sortTypes;
  }

  get allCities() {
    return this.#destinations.map((destination) => destination.name);
  }

  /**
   *
   * @param {import('../trip-api-service.js').TripEvent} tripEvent
   * @returns {TripEvent}
   */
  #adaptToClient = (tripEvent) => ({
    id: tripEvent.id,
    type: tripEvent.type,
    destination: tripEvent.destination,
    basePrice: tripEvent['base_price'],
    dateFrom: new Date(tripEvent['date_from']),
    dateTo: new Date(tripEvent['date_to']),
    isFavorite: tripEvent['is_favorite'],
    offers: (this.#offers || []).flatMap((type) =>
      type.offers.filter((offer) => tripEvent.offers.includes(offer.id))
    ),
  });
}

/**
 *
 * @typedef {{
 *   type: import('../trip-api-service.js').TripEventType,
 *   offers: Array<TripOffer>
 * }} TripOfferTyped
 *
 * @typedef {{
 *  id: string,
 *  title: string,
 *  price: number,
 *  isChecked: boolean
 * }} TripOffer
 *
 * @typedef {{
 *  id: string,
 *  type: import('../trip-api-service.js').TripEventType,
 *  destination: string,
 *  dateFrom: Date,
 *  dateTo: Date,
 *  basePrice: number,
 *  offers: Array<TripOffer>,
 *  isFavorite: boolean
 * }} TripEvent
 *
 */
