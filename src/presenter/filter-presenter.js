import FilterView from '../view/filter-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Filters, UpdateType } from '../const.js';
import { filter } from '../utils.js';

export default class FilterPresenter {
  #tripEventsModel = null;
  #tripFilterContainer = null;
  #filterModel = null;

  #filterComponent = null;

  constructor({ tripEventsModel, filterModel, filterContainer }) {
    this.#tripFilterContainer = filterContainer;
    this.#tripEventsModel = tripEventsModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#tripEventsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const tripEvents = this.#tripEventsModel.tripEvents;

    return Object.values(Filters).map((type) => ({
      type,
      count: filter[type](tripEvents).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filters,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#tripFilterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filters === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
