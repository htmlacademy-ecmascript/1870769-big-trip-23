import { render, replace, remove } from '../framework/render.js';
import TripEventsView from '../view/trip-events-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class TripEventsPresenter {
  #container = null;
  #openedTripEvent = [];

  #tripEventView = null;
  #tripEditFormView = null;

  #tripEvent = null;
  #onViewChange = null;

  #onFavoriteClick = null;

  constructor({ tripEventsElement, onViewChange, onFavoriteClick }) {
    this.#container = tripEventsElement;
    this.#onViewChange = onViewChange;
    this.#onFavoriteClick = onFavoriteClick;
  }

  init(tripEvent) {
    this.#tripEvent = tripEvent;

    this.#tripEventView = new TripEventsView({
      tripEvent,
      onOpenEdit: this.#onClickOpenEditForm.bind(this),
      onFavoritClick: this.#handleFavoriteClick.bind(this)
    });

    this.#tripEditFormView = new EditFormView({
      tripEvent: this.#tripEvent,
      onSubmitEditForm: this.#onSubmitEditForm.bind(this),
      onClickCloseEditForm: this.#onClickCloseEditForm.bind(this)
    });

    render(this.#tripEventView, this.#container);
  }

  destroy() {
    remove(this.#tripEventView);
    remove(this.#tripEditFormView);
  }

  resetView() {
    if (this.#openedTripEvent.length > 0) {
      this.#switchToViewForm();
    }
  }

  #switchToViewForm = () => {
    if (this.#openedTripEvent.length > 0) {
      const [editFormComponent, eventViewComponent, escHandler] = this.#openedTripEvent;

      if (editFormComponent && eventViewComponent) {
        replace(eventViewComponent, editFormComponent);
        document.removeEventListener('keydown', escHandler);
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
    document.addEventListener('keydown', this.#onEscKeydown.bind(this));
  };

  #onClickOpenEditForm() {
    this.#switchToEditForm();
  }

  #onSubmitEditForm () {
    this.#switchToViewForm();
  }

  #onClickCloseEditForm() {
    this.#switchToViewForm();
  }

  #onEscKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#switchToViewForm();
    }
  }

  #handleFavoriteClick = () => {
    this.#onFavoriteClick(this.#tripEvent);
  };
}
