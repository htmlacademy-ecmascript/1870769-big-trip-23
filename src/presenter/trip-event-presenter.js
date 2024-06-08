import { render, replace, remove } from '../framework/render.js';
import TripEventsView from '../view/trip-events-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class TripEventsPresenter {
  #container = null;
  #openedTripEvent = [];

  #tripEventView = null;
  #tripEditFormView = null;

  #tripEvent = null;
  #allCitiesDestinations = [];
  #offers = [];

  #onViewChange = null;
  #onFavoriteClick = null;
  #escKeydownHandler = null;

  constructor({ tripEventsElement, onViewChange, onFavoriteClick }) {
    this.#container = tripEventsElement;
    this.#onViewChange = onViewChange;
    this.#onFavoriteClick = onFavoriteClick;
  }

  init(tripEvent, cities, offers) {
    this.#tripEvent = tripEvent;
    this.#allCitiesDestinations = cities;
    this.#offers = offers;

    this.#tripEventView = new TripEventsView({
      tripEvent,
      onOpenEdit: this.#onClickOpenEditForm.bind(this),
      onFavoritClick: this.#handleFavoriteClick.bind(this)
    });

    this.#tripEditFormView = new EditFormView({
      tripEvent: this.#tripEvent,
      cities: this.#allCitiesDestinations,
      offers: this.#offers,
      onSubmitEditForm: this.#onSubmitEditForm.bind(this),
      onClickCloseEditForm: this.#onClickCloseEditForm.bind(this),
    });

    render(this.#tripEventView, this.#container);
  }

  destroy() {
    remove(this.#tripEventView);
    remove(this.#tripEditFormView);
  }

  resetView() {
    if (this.#openedTripEvent.length > 0) {
      this.#tripEditFormView.reset(this.#tripEvent);
      this.#switchToViewForm();
    }
  }

  #switchToViewForm = () => {
    if (this.#openedTripEvent.length > 0) {
      const [editFormComponent, eventViewComponent] = this.#openedTripEvent;

      if (editFormComponent && eventViewComponent) {
        replace(eventViewComponent, editFormComponent);
        if (this.#escKeydownHandler) {
          document.removeEventListener('keydown', this.#escKeydownHandler);
          this.#escKeydownHandler = null;
        }
        this.#openedTripEvent = [];
      }
    }
  };

  #switchToEditForm = () => {
    if (this.#openedTripEvent.length > 0){
      this.#switchToViewForm();
    }

    this.#onViewChange();
    this.#openedTripEvent = [this.#tripEditFormView, this.#tripEventView, this.#onEscKeydown.bind(this)];
    replace(this.#tripEditFormView, this.#tripEventView);
    this.#escKeydownHandler = this.#onEscKeydown.bind(this);
    document.addEventListener('keydown', this.#escKeydownHandler);
  };

  #onClickOpenEditForm() {
    this.#switchToEditForm();
  }

  #onSubmitEditForm (tripEvent) {
    this.#tripEditFormView.reset(tripEvent);
    this.#switchToViewForm();
    this.#tripEventView.reset(tripEvent);
  }

  #onClickCloseEditForm() {
    this.#tripEditFormView.reset(this.#tripEvent);
    this.#switchToViewForm();
  }

  #onEscKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#tripEditFormView.reset(this.#tripEvent);
      this.#switchToViewForm();
    }
  }

  #handleFavoriteClick = () => {
    this.#onFavoriteClick(this.#tripEvent);
  };
}
