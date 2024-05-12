import { render, RenderPosition, replace } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import FilterView from '../view/filter-view.js';
import TripEventsView from '../view/trip-events-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class Presenter {
  constructor({ tripEventsModel }) {
    this.tripFilterElement = document.querySelector('.trip-controls__filters');
    this.tripEventsElement = document.querySelector('.trip-events');

    this.tripEventsListElement = document.createElement('ul');
    this.tripEventsListElement.classList.add('trip-events__list');
    this.tripEventsElement.appendChild(this.tripEventsListElement);

    this.tripEventsModel = tripEventsModel;
  }

  renderFilter() {
    render(new FilterView(), this.tripFilterElement);
  }

  renderSorting() {
    render(new SortingView(), this.tripEventsElement, RenderPosition.AFTERBEGIN);
  }

  renderTripEvents() {
    this.#renderTripEvents(this.tripEventsModel);
  }

  // renderEditForm() {
  //   render(new EditFormView(), this.wayPointList, RenderPosition.AFTERBEGIN);
  // }

  init() {
    this.renderFilter();
    this.renderSorting();
    this.renderTripEvents();
    // this.renderEditForm();
  }

  #renderTripEvents({ tripEvents }) {
    tripEvents.forEach((tripEvent) => {
      this.#renderTripEvent(tripEvent);
    });
  }

  #renderTripEvent(tripEvent) {
    const onClickOpenEditForm = () => switchToEditForm();
    const onSubmitEditForm = () => switchToViewMode();
    const onClickCloseEditForm = () => switchToViewMode();

    const onEscKeydown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        switchToViewMode();
      }
    };

    const tripEventView = new TripEventsView({ tripEvent, onOpenEdit: onClickOpenEditForm });
    const tripEditFormComponent = new EditFormView({
      onSubmitEditForm: onSubmitEditForm,
      onClickCloseEditFiorm: onClickCloseEditForm
    });

    function switchToEditForm() {
      replace(tripEditFormComponent, tripEventView);
      document.addEventListener('keydown', onEscKeydown);
    }

    function switchToViewMode() {
      replace(tripEventView, tripEditFormComponent);
      document.removeEventListener('keydown', onEscKeydown);
    }

    render(tripEventView, this.tripEventsElement);
  }
}
