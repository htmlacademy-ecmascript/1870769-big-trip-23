import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { DateFormats, TRIP_EVENT_TYPE } from '../const.js';
import dayjs from 'dayjs';

const generateEventTypeItem = (type) => `
<div class="event__type-item">
  <input id="event-type-${type.toLowerCase()}-1"
  class="event__type-input  visually-hidden" type="radio" name="event-type"
  value="${type.toLowerCase()}">
  <label class="event__type-label  event__type-label--${type.toLowerCase()}"
   for="event-type-${type.toLowerCase()}-1">${type}</label>
</div>
`;

const generateOfferHTML = (allOffers, isAnyOffers) => {
  const words = allOffers[0].title.split(' ');
  const lastWord = words[words.length - 1];
  let count = 0;

  if (isAnyOffers) {
    return allOffers.map((offer) => {
      count++;
      return `
<div class="event__offer-selector">
  <input class="event__offer-checkbox visually-hidden"
   id="event-offer-${offer.id}-${count}"
   ${offer.isChecked ? 'checked' : ''}
  type="checkbox" name="event-offer-${lastWord}">
  <label class="event__offer-label" for="event-offer-${offer.id}-${count}">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>
`;
    }).join('');
  } else {
    return '';
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

const generateEventFieldDestination = (type, name, allCities) => {
  const cityOptions = allCities.map((cityName) => `<option value="${cityName}"></option>`).join('');

  return (`
  <label class="event__label  event__type-output" for="event-destination-1">
    ${type}
  </label>
  <input class="event__input  event__input--destination" id="event-destination-1"
  type="text" name="event-destination" value="${name}" list="destination-list-1">
  <datalist id="destination-list-1">
  ${cityOptions}
  </datalist>
`);
};

const createEditFormView = ({
  type,
  destination,
  eventDate,
  eventSchedule: {dateFrom, dateTo},
  allOffers,
  isAnyOffers,
  basePrice,
  allCities,
}) => {
  const { DATE_TIME } = DateFormats;
  const offersHTML = generateOfferHTML(allOffers, isAnyOffers);
  const { picture, name } = destination;

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
          ${generateEventFieldDestination(type, name, allCities)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
          value="${dayjs(eventDate).format(DATE_TIME)} ${dateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
          value="${dayjs(eventDate).format(DATE_TIME)} ${dateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text"
          name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersHTML}
          </div>
        </section>
        ${createSectionDestination(picture)}
      </section>
    </form>
    </li>
`;
};

export default class EditFormView extends AbstractStatefulView {
  #closeForm = null;
  #submitForm = null;

  constructor({
    tripEvent,
    onClickCloseEditForm,
    onSubmitEditForm,
    cities,
    offers,
    destinations
  }) {
    super();

    this._setState({
      ...EditFormView.parseListElementToState(tripEvent),
      allOffers: offers,
      allCities: cities,
      destinations: destinations
    });

    this.#closeForm = onClickCloseEditForm;
    this.#submitForm = onSubmitEditForm;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormView(this._state);
  }

  reset(tripEvent) {
    this.updateElement(
      EditFormView.parseListElementToState(tripEvent)
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#onCloseHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#onCloseHandler);

    this.element.querySelector('form')
      .addEventListener('submit', this.#onSubmitHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#onDestinationInputHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('input', this.#eventTypeToggleHandler);

    if (this._state.offers.length !== 0) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('click', this.#offersChangeToggleHandler);
    }
  }

  #onCloseHandler = (evt) => {
    evt.preventDefault();
    this.#closeForm();
  };

  #onSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#submitForm(EditFormView.parseStateToListElement(this._state));
  };

  #onDestinationInputHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this._state.destinations.find((destination) => destination.name === evt.target.value);

    this._setState({
      destination: selectedDestination
    });

    this.updateElement({
      destination: selectedDestination
    });
  };

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.value !== undefined) {
      const newEventType = evt.target.value;
      const newOffers = this.#getOffersByType(newEventType);

      this._setState({
        type: newEventType,
        allOffers: newOffers
      });

      this.updateElement({
        type: newEventType,
        allOffers: newOffers
      });
    }
  };

  #getOffersByType(type) {
    const allOffers = {
      'taxi': [
        { id: 1, title: 'Upgrade to a business class', price: 50, isChecked: false },
        { id: 2, title: 'Choose the radio station', price: 10, isChecked: false },
      ],
      'bus': [
        { id: 3, title: 'Infotainment system', price: 5, isChecked: false },
        { id: 4, title: 'Comfortable seats', price: 15, isChecked: false },
      ],
      'train': [
        { id: 5, title: 'Meal', price: 10, isChecked: false },
        { id: 6, title: 'Wifi', price: 5, isChecked: false },
      ],
      'ship': [
        { id: 7, title: 'Private cabin', price: 100, isChecked: false },
        { id: 8, title: 'Tour guide', price: 50, isChecked: false },
      ],
      'drive': [
        { id: 9, title: 'GPS', price: 20, isChecked: false },
        { id: 10, title: 'Child seat', price: 10, isChecked: false },
      ],
      'flight': [
        { id: 11, title: 'Add luggage', price: 30, isChecked: false },
        { id: 12, title: 'Premium seat', price: 100, isChecked: false },
      ],
      'check-in': [
        { id: 13, title: 'Early check-in', price: 20, isChecked: false },
        { id: 14, title: 'Late check-out', price: 20, isChecked: false },
      ],
      'sightseeing': [
        { id: 15, title: 'Local guide', price: 40, isChecked: false },
        { id: 16, title: 'Skip-the-line', price: 30, isChecked: false },
      ],
      'restaurant': [
        { id: 17, title: 'Vegetarian option', price: 15, isChecked: false },
        { id: 18, title: 'VIP area', price: 70, isChecked: false },
      ],
    };

    return allOffers[type] || [];
  }

  #offersChangeToggleHandler = () => {
    const elements = this.element.querySelectorAll('.event__offer-checkbox');

    for(let i = 0; i < this._state.offers.length; i++) {
      if(elements[i].checked) {
        this._state.offers[i].isChecked = true;
        this._state.isAnyOffers = true;
      } else {
        this._state.offers[i].isChecked = false;
      }
    }

    this._setState({
      allOffers: this._state.offers
    });
  };

  static parseListElementToState(tripEvent) {
    return {...tripEvent,
      isAnyOffers: tripEvent.offers.length !== 0,
    };
  }

  static parseStateToListElement(state) {
    const tripEvent = {...state};

    if (!tripEvent.isAnyOffers) {
      tripEvent.offers.forEach((offer) => {
        offer.isFavorite = false;
      });
    }

    delete tripEvent.isAnyOffers;

    return tripEvent;
  }
}
