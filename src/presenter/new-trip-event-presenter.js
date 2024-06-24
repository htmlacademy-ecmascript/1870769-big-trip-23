import { render, remove, RenderPosition } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import { UpdateType, UserAction, DEFAULT_TRIP_EVENT } from '../const.js';

/**
 * @typedef {import('../model/trip-event-model.js').TripEvent} TripEvent
 * @typedef {import('../model/trip-event-model.js').TripOfferTyped} TripOfferTyped
 * @typedef {import('../model/trip-event-model.js').TripOffer} TripOffer
 * @typedef {import('../view/edit-form-view.js').State} State
 * @typedef {import('../view/edit-form-view.js').Destination} Destination
 */
export default class NewTripEventPresenter {
  /** @type {?HTMLElement} */
  #eventContainer = null;

  /** @type {?Function} */
  #handleDataChange = null;

  /** @type {?Function} */
  #handleDestroy = null;

  /** @type {?EditFormView} */
  #tripEditFormView = null;

  /** @type {?import('../model/trip-event-model.js').TripEvent} */
  #tripEvent = null;

  /** @type {string[]} */
  #allCitiesDestinations = [];
  /** @type {TripOfferTyped[]} */
  #offers = [];
  /** @type {Destination[]} */
  #destinations = [];

  /**
   * @param {{container: HTMLElement, onDataChange: Function, onDestroy: Function}} param
   */
  constructor({container, onDataChange, onDestroy}) {
    this.#eventContainer = container;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  /**
   * @param {{
   *   tripEvents?: TripEvent,
   *   allCities: string[],
   *   offers: TripOfferTyped[],
   *   destinations: Destination[]
   * }} param
   */
  init({ tripEvents = DEFAULT_TRIP_EVENT, allCities, offers, destinations }) {
    if (this.#tripEditFormView !== null) {
      return;
    }
    this.#tripEvent = tripEvents;
    this.#allCitiesDestinations = allCities;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#tripEditFormView = new EditFormView({
      tripEvent: this.#tripEvent,
      cities: this.#allCitiesDestinations,
      offers: this.#offers.find(({ type }) => type === this.#tripEvent?.type)?.offers || [],
      allOffers: this.#offers,
      destinations: this.#destinations,
      onSubmitEditForm: this.#handleFormSubmit,
      onClickCloseEditForm: this.#handleCancelEditForm,
      onClickDeleteEditForm: this.#handleCancelEditForm,
    });

    document.addEventListener('keydown', this.#escKeyDownHandler);
    render(this.#tripEditFormView, this.#eventContainer, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    if (this.#tripEditFormView === null) {
      return;
    }

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#tripEditFormView = null;
    remove(this.#tripEditFormView);
    this.#handleDestroy();
  }

  removeForm() {
    remove(this.#tripEditFormView);
    this.destroy();

    this.#tripEditFormView = null;
  }

  setSaving() {
    this.#tripEditFormView.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#tripEditFormView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#tripEditFormView.shake(resetFormState);
  }

  /**
   * @param {TripEvent} tripEvent
   */
  #handleFormSubmit = (tripEvent) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MAJOR,
      tripEvent
    );
  };

  /**
   * @param {KeyboardEvent} evt
   */
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleCancelEditForm = () => {
    this.destroy();
  };
}
