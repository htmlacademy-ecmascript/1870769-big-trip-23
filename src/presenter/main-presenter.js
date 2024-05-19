import { render, RenderPosition } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import FilterView from '../view/filter-view.js';
import TripEventsPresenter from './trip-events-presenter.js';

export default class MainPresenter {
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
    this.#renderTripEvents(this.tripEventsModel, this.tripEventsElement);
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

  #renderTripEvents() {
    const tripEventsPresenter = new TripEventsPresenter({
      tripEvents: this.tripEventsModel.tripEvents,
      tripEventsElement: this.tripEventsElement
    });
    tripEventsPresenter.init();
  }
}
