import { render, replace, remove } from '../framework/render.js';
import TripEventsView from '../view/trip-events-view.js';
import EditFormView from '../view/edit-form-view.js';
import { UserAction, UpdateType } from '../const.js';
import { isDatesEqual, isTripEventHaveOffers } from '../utils.js';

export default class TripEventsPresenter {
  #container = null;
  #openedTripEvent = [];

  #tripEventView = null;
  #tripEditFormView = null;

  #tripEvent = null;
  #allCitiesDestinations = [];
  #offers = [];
  #destinations = [];

  #onViewChange = null;
  #handleDataChange = null;
  #escKeydownHandler = null;

  constructor({ tripEventsElement, onViewChange, onDataChange }) {
    this.#container = tripEventsElement;
    this.#onViewChange = onViewChange;
    this.#handleDataChange = onDataChange;
  }

  init(tripEvent, cities, offers, destinations) {
    this.#tripEvent = tripEvent;
    this.#allCitiesDestinations = cities;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#tripEventView = new TripEventsView({
      tripEvent: this.#tripEvent,
      onOpenEdit: this.#onClickOpenEditForm.bind(this),
      onFavoritClick: this.#handleFavoriteClick.bind(this)
    });

    this.#tripEditFormView = new EditFormView({
      tripEvent: this.#tripEvent,
      cities: this.#allCitiesDestinations,
      offers: this.#offers,
      destinations: this.#destinations,
      onSubmitEditForm: this.#onSubmitEditForm.bind(this),
      onClickCloseEditForm: this.#onClickCloseEditForm.bind(this),
      onClickDeleteEditForm: this.#handleDeleteClick.bind(this)
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

  #onSubmitEditForm = (update) => {
    const isMinorUpdate =
    !isDatesEqual(this.#tripEvent.eventSchedule.dateFrom, update.eventSchedule.dateFrom) ||
    isTripEventHaveOffers(this.#tripEvent.eventSchedule.offers) !== isTripEventHaveOffers(update.eventSchedule.offers);

    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );

    this.#switchToViewForm();
  };

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

  #handleDeleteClick(tripEvent) {
    this.#handleDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      tripEvent
    );
    this.#switchToViewForm();
  }

  #handleFavoriteClick() {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#tripEvent, isFavorite: !this.#tripEvent.isFavorite}
    );
    this.#switchToViewForm();
  }
}
