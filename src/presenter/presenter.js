import { render, RenderPosition, replace } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import FilterView from '../view/filter-view.js';
import TripEventsView from '../view/trip-events-view.js';
import EditFormView from '../view/edit-form-view.js';
import NoTripEventsView from '../view/no-trip-events-view.js';

export default class Presenter {
  #openedTripEvent = [];

  constructor({ tripEventsModel }) {
    this.tripFilterElement = document.querySelector('.trip-controls__filters');
    this.tripEventsElement = document.querySelector('.trip-events');

    this.tripEventsListElement = document.createElement('ul');
    this.tripEventsListElement.classList.add('trip-events__list');
    this.tripEventsElement.appendChild(this.tripEventsListElement);

    this.tripEventsModel = tripEventsModel;
  }

  renderFilter() {
    this.#renderFilterView(this.tripEventsModel);
  }

  renderSorting() {
    this.#renderSortingView(this.tripEventsModel);
  }

  renderTripEvents() {
    this.#renderTripEvents(this.tripEventsModel);
  }

  init() {
    this.renderFilter();
    this.renderSorting();
    this.renderTripEvents();
  }

  #renderFilterView({ filters }) {
    render(new FilterView({ filters }), this.tripFilterElement);
  }

  #renderSortingView({ sortTypes }) {
    render(new SortingView({ sortTypes }), this.tripEventsElement, RenderPosition.AFTERBEGIN);
  }

  #renderNoTripEventsView() {
    render(new NoTripEventsView({ filters: this.tripEventsModel.filters[0] }), this.tripEventsElement);
  }

  #renderTripEvents({ tripEvents }) {
    if (tripEvents.length === 0) {
      this.#renderNoTripEventsView();
      return;
    }
    tripEvents.forEach((tripEvent) => {
      this.#renderTripEvent(tripEvent);
    });
  }

  // отрефакторить в отдельный файл
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

    render(tripEventView, this.tripEventsElement);
  }
}
