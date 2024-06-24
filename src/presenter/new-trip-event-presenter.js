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
      tripEvent: this.#tripEvent,
      cities: this.#allCitiesDestinations,
      offers: this.#offers.find(({ type }) => type === this.#tripEvent.type)?.offers || [],
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
