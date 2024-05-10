import { render, RenderPosition } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import FilterView from '../view/filter-view.js';
import TripEventsView from '../view/trip-events-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class Presenter {
  constructor({ tripEventsModel }) {
    this.tripFilterElement = document.querySelector('.trip-controls__filters');
    this.tripEventsElement = document.querySelector('.trip-events');

    this.wayPointList = document.createElement('ul');
    this.wayPointList.classList.add('trip-events__list');
    this.tripEventsElement.appendChild(this.wayPointList);

    this.tripEventsModel = tripEventsModel;
  }

  renderFilter() {
    render(new FilterView(), this.tripFilterElement);
  }

  renderSorting() {
    render(new SortingView(), this.tripEventsElement, RenderPosition.AFTERBEGIN);
  }

  renderTripEvents() {
    this.tripEventsModel.tripEvents.forEach((tripEvent) => {
      render(new TripEventsView({ tripEvent }), this.tripEventsElement);
    });
  }

  renderEditForm() {
    render(new EditFormView(), this.wayPointList, RenderPosition.AFTERBEGIN);
  }

  init() {
    this.renderFilter();
    this.renderSorting();
    this.renderTripEvents();
    this.renderEditForm();
  }
}
