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
    const onClickOpenEditForm = () => switchToEditForm();
    const onSubmitEditForm = () => switchToViewForm();
    const onClickCloseEditForm = () => switchToViewForm();

    const onEscKeydown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        switchToViewForm();
      }
    };

    const tripEventView = new TripEventsView({ tripEvent, onOpenEdit: onClickOpenEditForm });
    const tripEditFormView = new EditFormView({
      tripEvent,
      onSubmitEditForm: onSubmitEditForm,
      onClickCloseEditFiorm: onClickCloseEditForm
    });

    const self = this;

    function switchToEditForm() {
      if (self.#openedTripEvent.length > 0){
        switchToViewForm();
      }

      self.#openedTripEvent = [tripEditFormView, tripEventView, onEscKeydown];
      replace(tripEditFormView, tripEventView);
      document.addEventListener('keydown', onEscKeydown);
    }

    function switchToViewForm() {
      replace(self.#openedTripEvent[1], self.#openedTripEvent[0]);
      document.removeEventListener('keydown', self.#openedTripEvent[2]);
      self.#openedTripEvent = [];
    }

    render(tripEventView, this.#container);
  }
}
