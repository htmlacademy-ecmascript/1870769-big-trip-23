import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const generateOfferHTML = (offers) => offers.map((offer) => {
  if (!offer.isChecked) {
    return '';
  }

  return `
  <li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`;
}).join('');

const createTripEventsView = ({
  type,
  eventDate,
  destination,
  offers,
  eventSchedule: {dateFrom, dateTo, eventDuration},
  basePrice,
  isFavorite
}) => {
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  return `<ul class="trip-events__list">
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime=${eventDate}>${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>

        <h3 class="event__title">${type} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${dateFrom}>${dateFrom}</time>
            &mdash;
            <time class="event__end-time" datetime=${dateTo}>${dateTo}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>

        <ul class="event__selected-offers">
          ${generateOfferHTML(offers)}
        </ul>

        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  </ul>`;
};

export default class TripEventsView extends AbstractStatefulView {
  #eventRollupBtnElement = null;
  #eventFavoritBtnElement = null;
  #clickFavoritBtn = null;
  #clickOpenHandler = null;

  constructor({ tripEvent, onOpenEdit, onFavoritClick }) {
    super();
    this._setState(tripEvent);
    this.#clickOpenHandler = onOpenEdit;
    this.#clickFavoritBtn = onFavoritClick;

    this._restoreHandlers();
  }

  get template() {
    return createTripEventsView(this._state);
  }

  reset(tripEvent) {
    this.updateElement(tripEvent);
  }

  _restoreHandlers() {
    this.#eventRollupBtnElement = this.element.querySelector('.event__rollup-btn');
    this.#eventFavoritBtnElement = this.element.querySelector('.event__favorite-btn');

    this.#eventRollupBtnElement.addEventListener('click', this.#onOpenClickHandler);
    this.#eventFavoritBtnElement.addEventListener('click', this.#onFavoritClickHandler);
  }

  #onOpenClickHandler = (evt) => {
    evt.preventDefault();
    this.#clickOpenHandler();
  };

  #onFavoritClickHandler = (evt) => {
    evt.preventDefault();
    this.#clickFavoritBtn();
  };
}
