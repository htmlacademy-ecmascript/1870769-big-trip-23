import { render, RenderPosition } from '../render.js';
import SortingView from '../view/sorting-view.js';
import FilterView from '../view/filter-view.js';
import TripEventsView from '../view/trip-events-view.js';
import AddFormView from '../view/add-form-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class GeneralPresenter {
  constructor() {
    this.tripFilterElement = document.querySelector('.trip-controls__filters');
    this.tripEventsElement = document.querySelector('.trip-events');

    this.wayPointList = document.createElement('ul');
    this.wayPointList.classList.add('trip-events__list');
    this.tripEventsElement.appendChild(this.wayPointList);
  }

  renderFilter() {
    render(new FilterView(), this.tripFilterElement);
  }

  renderSorting() {
    render(new SortingView(), this.tripEventsElement, RenderPosition.AFTERBEGIN);
  }

  renderTripEvents() {
    for (let i = 0; i < 3; i++) {
      render(new TripEventsView(), this.tripEventsElement);
    }
  }

  renderAddForm() {
    render(new AddFormView(), this.wayPointList);
  }

  renderEditForm() {
    render(new EditFormView(), this.wayPointList);
  }

  init() {
    this.renderFilter();
    this.renderSorting();
    this.renderTripEvents();
    this.renderAddForm();
    this.renderEditForm();
  }
}
