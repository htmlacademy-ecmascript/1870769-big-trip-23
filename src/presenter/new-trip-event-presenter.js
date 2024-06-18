import { render, remove, RenderPosition } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import { UpdateType, UserAction, DEFAULT_TRIP_EVENT } from '../const.js';

export default class NewTripEventPresenter {
  #eventContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #tripEditFormView = null;
  #tripEvent = null;
  #allCitiesDestinations = [];
  #offers = [];
  #destinations = [];

  constructor({container, onDataChange, onDestroy}) {
    this.#eventContainer = container;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init({ tripEvents = DEFAULT_TRIP_EVENT, allCities, offers, destinations }) {
    if (this.#tripEditFormView !== null) {
      return;
    }
    this.#tripEvent = tripEvents;
    this.#allCitiesDestinations = allCities;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#tripEditFormView = new EditFormView({
      tripEvents: this.#tripEvent,
      offers: this.#offers,
      destinations:  this.#destinations,
      cities: this.#allCitiesDestinations,
      onSubmitEditForm: this.#handleFormSubmit.bind(this),
      onClickCloseEditForm: this.#handleCancelEditForm.bind(this),
      onClickDeleteEditForm: this.#handleCancelEditForm.bind(this),
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

  #handleFormSubmit = (tripEvent) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MAJOR,
      tripEvent
    );
  };

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
