import { render, RenderPosition, remove } from '../framework/render.js';
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

    this.tripEventsPresenter = new TripEventsPresenter({
      tripEvents: this.tripEventsModel.tripEvents,
      tripEventsElement: this.tripEventsElement
    });
  }

  renderFilter() {
    this.#renderFilterView(this.tripEventsModel);
  }

  renderSorting() {
    this.#renderSortingView(this.tripEventsModel);
  }

  renderTripEvents() {
    this.#renderTripEvents();
  }

  init() {
    this.renderFilter();
    this.renderSorting();
    this.renderTripEvents();
  }

  #renderFilterView({ filters }) {
    render(new FilterView({ filters }), this.tripFilterElement, RenderPosition.BEFOREBEGIN);
  }

  #renderSortingView({ sortTypes }) {
    render(
      new SortingView({
        sortTypes: sortTypes,
        onSortTypeChange: this.#handleSortTypeChange
      }),
      this.tripEventsElement,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderTripEvents() {
    this.tripEventsPresenter.init();
  }

  #handleSortTypeChange = (sortType) => {
    this.tripEventsPresenter.setSorting(sortType);
  };
}
