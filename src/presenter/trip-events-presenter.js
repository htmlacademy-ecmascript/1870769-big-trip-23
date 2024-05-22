import { render, replace } from '../framework/render.js';
import TripEventsView from '../view/trip-events-view.js';
import EditFormView from '../view/edit-form-view.js';
import NoTripEventsView from '../view/no-trip-events-view.js';

export default class TripEventsPresenter {
  #tripEvents = [];
  #container = null;
  #openedTripEvent = [];

  constructor({ tripEvents, tripEventsElement }) {
    this.#tripEvents = tripEvents;
    this.#container = tripEventsElement;
  }

  init() {
    this.#renderTripEvents(this.#tripEvents);
  }

  #renderNoTripEventsView() {
    render(new NoTripEventsView({ filters: this.#tripEvents.filters[0] }), this.#container);
  }

  #renderTripEvents(tripEvents) {
    if (tripEvents.length === 0) {
      this.#renderNoTripEventsView();
      return;
    }
    tripEvents.forEach((tripEvent) => {
      this.#renderTripEvent(tripEvent);
    });
  }

  #renderTripEvent(tripEvent) {
    const tripEventView = new TripEventsView({
      tripEvent,
      onOpenEdit: onClickOpenEditForm,
      onFavoritClick: this.#handleFavoriteClick
    });

    const tripEditFormView = new EditFormView({
      tripEvent,
      onSubmitEditForm: onSubmitEditForm,
      onClickCloseEditFiorm: onClickCloseEditForm
    });

    const switchToViewForm = () => {
      replace(this.#openedTripEvent[1], this.#openedTripEvent[0]);
      document.removeEventListener('keydown', this.#openedTripEvent[2]);
      this.#openedTripEvent = [];
    };

    const switchToEditForm = () => {
      if (this.#openedTripEvent.length > 0){
        switchToViewForm();
      }

      this.#openedTripEvent = [tripEditFormView, tripEventView, onEscKeydown];
      replace(tripEditFormView, tripEventView);
      document.addEventListener('keydown', onEscKeydown);
    };

    function onClickOpenEditForm() {
      switchToEditForm();
    }

    function onSubmitEditForm () {
      switchToViewForm();
    }

    function onClickCloseEditForm() {
      switchToViewForm();
    }

    function onEscKeydown(evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        switchToViewForm();
      }
    }

    render(tripEventView, this.#container);
  }

  #handleFavoriteClick = (tripEvent) => {
    tripEvent.isFavorite = !tripEvent.isFavorite;
    this.#updateTripEvent(tripEvent);
  };

  #updateTripEvent(updatedEvent) {
    const index = this.#tripEvents.findIndex((event) => event.id === updatedEvent.id);
    if (index === -1) {
      return;
    }

    this.#tripEvents[index] = updatedEvent;

    this.#clearTripEventsList();
    this.#renderTripEvent(updatedEvent);
  }

  #clearTripEventsList() {
    this.#container.innerHTML = '';
  }
}
