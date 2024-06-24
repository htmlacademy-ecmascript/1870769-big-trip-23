import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { DateFormats, TRIP_EVENT_TYPE, DefaultFlatpickrConfig, DEFAULT_TRIP_EVENT } from '../const.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

/**
 *
 * @param {string} type
 * @param {boolean} isDisabled
 * @returns {string}
 */
const generateEventTypeItem = (type, isDisabled) => `
<div class="event__type-item">
  <input id="event-type-${type.toLowerCase()}-1"
  class="event__type-input  visually-hidden" type="radio" name="event-type"
  value="${type.toLowerCase()}"
  ${isDisabled ? 'disabled' : ''}>
  <label class="event__type-label  event__type-label--${type.toLowerCase()}"
   for="event-type-${type.toLowerCase()}-1">${type}</label>
</div>
`;

const generateOfferHTML = (allOffers, isAnyOffers, isDisabled) => {
  const words = allOffers[0].title.split(' ');
  const lastWord = words[words.length - 1];

  if (allOffers) {
    if (isAnyOffers) {
      return allOffers.map((offer) => `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden"
          id="event-offer-${offer.id}"
          ${isDisabled ? 'disabled' : ''}
          type="checkbox" name="event-offer-${lastWord}" ${offer.isChecked ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
    `).join('');
    } else {
      return '';
    }
  }
};

const createPhotoTape = (pictures) => `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        <img class="event__photo" src="${pictures}" alt="${pictures.description}">
      </div>
    </div>`;

const createSectionDestination = ({description, src}) => `
<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${description}</p>
  ${createPhotoTape(src)}
</section>`;

/**
 *
 * @param {string} type
 * @param {boolean} isDisabled
 * @returns {string}
 */
const generateEventFieldDestination = (type, destination, isDisabled, tripEvent) => {
  const allCities = destination.map((destinationName) => `<option value="${destinationName.name}"></option>`).join('');
  const { name } = destination.find((destinationName) => destinationName.id === tripEvent.destination);

  return (`
  <label class="event__label  event__type-output" for="event-destination-1">
    ${type}
  </label>
  <input class="event__input  event__input--destination" id="event-destination-1"
  type="text" name="event-destination" value="${name}" list="destination-list-1"
  ${isDisabled ? 'disabled' : ''}>
  <datalist id="destination-list-1" >
  ${allCities}
  </datalist>
`);
};

/**
 *
 * @param {{
 *  type: string,
 *  destination: {
 *    name: string,
 *    pictures: Array<{
 *      src: string,
 *      description: string
 *    }>
 *  },
 *  eventDate: string,
 *  eventSchedule: {
 *    dateFrom: string,
 *    dateTo: string
 *  },
 *  offers: Array<{
 *    id: string,
 *    title: string,
 *    price: number,
 *    isChecked: boolean
 *  }>,
 *  isAnyOffers: boolean,
 *  basePrice: number,
 *  allCities: string[],
 *  isDisabled: boolean,
 *  isSaving: boolean,
 *  isDeleting: boolean
 * }} param
 * @returns
 */
const createEditFormView = ({
  tripEvent,
  type,
  destination,
  eventDate,
  eventSchedule: {dateFrom, dateTo},
  offers,
  isAnyOffers,
  basePrice,
  isDisabled,
  isSaving,
  isDeleting
}) => {
  const { DATE_TIME } = DateFormats;
  const { pictures, name } = destination.find((destinationName) => destinationName.id === tripEvent.destination);


  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17"
              src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>

          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${TRIP_EVENT_TYPE.map((eventType) => generateEventTypeItem(eventType, type === eventType)).join('  ')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          ${generateEventFieldDestination(type, destination, name, tripEvent, isDisabled)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
          value="${dayjs(eventDate).format(DATE_TIME)} ${dateFrom}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
          value="${dayjs(eventDate).format(DATE_TIME)} ${dateTo}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text"
          name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset">${isDeleting ? 'Delete...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        ${offers.length > 0 ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${generateOfferHTML(offers, isAnyOffers, isDisabled)}
          </div>
        </section>` : ''}
        ${pictures?.[0] ? createSectionDestination(pictures[0]) : ''}
      </section>
    </form>
    </li>
`;
};

export default class EditFormView extends AbstractStatefulView {
  /**
   * @type {?State}
   **/
  #initialState = null;

  /** @type {?Function} */
  #closeForm = null;

  /**
   * @callback OnSubmitEditForm
   * @param {import('../model/trip-event-model.js').TripEvent} tripEvent
   * @type {?OnSubmitEditForm}
   */
  #submitForm = null;

  /**
   * @callback OnDeleteEditForm
   * @param {import('../model/trip-event-model.js').TripEvent} tripEvent
   * @type {?OnDeleteEditForm}
   */
  #deleteForm = null;

  /** @type {?flatpickr.Instance} */
  #dateFromPicker = null;

  /** @type {?flatpickr.Instance} */
  #dateToPicker = null;

  constructor({
    tripEvent = DEFAULT_TRIP_EVENT,
    onClickCloseEditForm,
    onSubmitEditForm,
    onClickDeleteEditForm,
    cities,
    allOffers,
    offers,
    destinations,
  }) {
    super();

    this.#initialState = {
      tripEvent: EditFormView.parseTripEventToState(tripEvent),
      offers: offers,
      allOffers: allOffers,
      allCities: cities,
      destinations: destinations,
    };

    this.setState(this.#initialState);

    this.#closeForm = onClickCloseEditForm;
    this.#submitForm = onSubmitEditForm;
    this.#deleteForm = onClickDeleteEditForm;

    this._restoreHandlers();
  }

  /** @returns {Partial<State>} */
  get state() {
    return this._state;
  }

  /**
   * @param {Partial<State>} update
   */
  setState(update) {
    this._setState(update);
  }

  /**
   * @param {Partial<State>} update
   */
  updateState(update) {
    this.updateElement(update);
  }

  get template() {
    if (!this.state?.tripEvent || !this.state?.allCities) {
      return '';
    }
    /** @type {import('../model/trip-event-model.js').TripEvent} */
    const tripEvent = this.state;

    return createEditFormView({
      tripEvent: tripEvent.tripEvent,
      type: tripEvent.tripEvent.type,
      destination:  tripEvent.destinations,
      allCities: tripEvent.allCities,
      basePrice: tripEvent.tripEvent.basePrice,
      eventDate: dayjs(tripEvent.tripEvent.dateFrom).format(DateFormats.DATE),
      eventSchedule: {
        dateFrom: dayjs(tripEvent.tripEvent.dateFrom).format(DateFormats.TIME),
        dateTo: dayjs(tripEvent.tripEvent.dateTo).format(DateFormats.TIME),
      },
      offers: tripEvent.tripEvent.offers,
      isAnyOffers: tripEvent.tripEvent.isAnyOffers,
      isDeleting: tripEvent.tripEvent.isDeleting,
      isDisabled: tripEvent.tripEvent.isDisabled,
      isSaving: tripEvent.tripEvent.isSaving,
    });
  }

  reset(tripEvent) {
    this.updateState({
      ...this.#initialState,
      ...EditFormView.parseTripEventToState(tripEvent),
    });
  }

  removeElement() {
    super.removeElement();
    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }
    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  }

  _restoreHandlers() {
    // @ts-ignore
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#onCloseHandler);

    // @ts-ignore
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#onDeleteHandler);

    // @ts-ignore
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#onSubmitHandler);

    // @ts-ignore
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#onDestinationInputHandler);

    // @ts-ignore
    this.element
      .querySelector('.event__type-group')
      .addEventListener('input', this.#eventTypeToggleHandler);

    if (this?.state.offers?.length) {
      // @ts-ignore
      this.element
        ?.querySelector('.event__available-offers')
        ?.addEventListener('click', this.#offersChangeToggleHandler);
    }

    this.#setDatePickers({
      startTimeElement: this.element.querySelector('#event-start-time-1'),
      endTimeElement: this.element.querySelector('#event-end-time-1'),
    });
  }

  #setDatePickers = ({ startTimeElement, endTimeElement }) => {
    this.#dateFromPicker = flatpickr(startTimeElement, {
      ...DefaultFlatpickrConfig,
      defaultDate: this.state.tripEvent?.dateFrom,
      maxDate: this.state.tripEvent?.dateTo,
      onClose: this.#onDateFromChange,
    });

    this.#dateToPicker = flatpickr(endTimeElement, {
      ...DefaultFlatpickrConfig,
      defaultDate: this.state.tripEvent?.dateTo,
      minDate: this.state.tripEvent?.dateFrom,
      onClose: this.#onDateToChange,
    });
  };

  /** @type {import('flatpickr/dist/types/options.js').Hook} */
  #onDateFromChange = ([dateFrom]) => {
    this.updateState({
      // @ts-ignore
      tripEvent: {
        dateFrom: dateFrom,
      },
    });
  };

  /** @type {import('flatpickr/dist/types/options.js').Hook} */
  #onDateToChange = ([dateTo]) => {
    this.updateState({
      // @ts-ignore
      tripEvent: {
        dateTo: dateTo,
      },
    });
  };

  #onCloseHandler = (evt) => {
    evt.preventDefault();
    if (this.#closeForm) {
      this.#closeForm();
    }
  };

  #onDeleteHandler = (evt) => {
    evt.preventDefault();
    if (this.#deleteForm && this.state.tripEvent) {
      this.#deleteForm(EditFormView.parseStateToTripEvent(this.state.tripEvent));
    }
  };

  #onSubmitHandler = (evt) => {
    evt.preventDefault();
    if (this.#submitForm && this.state.tripEvent) {
      this.#submitForm(EditFormView.parseStateToTripEvent(this.state.tripEvent));
    }
  };

  #onDestinationInputHandler = (evt) => {
    evt.preventDefault();
    if (this.state.destinations) {
      const selectedDestination = this.state.destinations.find(
        (destination) => destination === evt.target.value
      );

      if (!selectedDestination) {
        return;
      }

      this.updateState({
        destinations: [selectedDestination],
      });
    }
  };

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.value !== undefined) {
      /** @type {import('../trip-api-service.js').TripEventType} */
      const newEventType = evt.target.value;
      const newOffers = this.#getOffersByType(newEventType);

      this.setState({
        // @ts-ignore
        tripEvent: {
          type: newEventType,
        },
        offers: newOffers,
      });

      this.updateState({
        type: newEventType,
        offers: newOffers,
      });
    }
  };

  #getOffersByType(type) {
    return (
      this.state?.allOffers?.find((offers) => offers.type === type)?.offers ||
      []
    );
  }

  #offersChangeToggleHandler = (evt) => {
    if (evt.target.classList.contains('event__offer-checkbox')) {
      const offerId = evt.target.id.split('-').slice(2).join('-');
      const foundOffer = this.state?.offers?.find(
        (offer) => offer.id === offerId
      );

      if (foundOffer === undefined) {
        return;
      }

      const newOffers = this.state?.offers?.map((offer) => {
        if (offer.id === offerId) {
          return {
            ...offer,
            isChecked: !offer.isChecked,
          };
        }
        return offer;
      });

      this.setState({
        offers: newOffers,
        // @ts-ignore
        tripEvent: {
          isAnyOffers: newOffers?.some((offer) => offer.isChecked) || false,
        },
      });
    }
  };

  /**
   *
   * @param {import('../model/trip-event-model.js').TripEvent} tripEvent
   * @returns {TripEventState}
   */
  static parseTripEventToState(tripEvent) {
    return {
      ...tripEvent,
      isAnyOffers: tripEvent.offers.length !== 0,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  /**
   *
   * @param {TripEventState} state
   * @returns {import('../model/trip-event-model.js').TripEvent}
   */
  static parseStateToTripEvent(state) {
    return {
      offers: state.isAnyOffers
        ? state.offers
        : state.offers.map((offer) => ({ ...offer, isChecked: false })),
      basePrice: state.basePrice,
      dateFrom: state.dateFrom,
      dateTo: state.dateTo,
      destination: state.destination,
      isFavorite: state.isFavorite,
      id: state.id,
      type: state.type,
    };
  }
}

/**
 * @typedef {import('../model/trip-event-model.js').TripEvent &
 *  {
 *    isAnyOffers: boolean,
 *    isDisabled: boolean,
 *    isSaving: boolean,
 *    isDeleting: boolean
 * }} TripEventState
 *
 * @typedef {{
 *  tripEvent: TripEventState,
 *  offers: Array<import('../model/trip-event-model.js').TripOffer>,
 *  allOffers: Array<import('../model/trip-event-model.js').TripOfferTyped>,
 *  allCities: Array<string>,
 *  destinations: Array<string>
 * }} State
 */
