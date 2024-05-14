import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (type, isFirst) => `
  <div class="trip-filters__filter">
    <input
    id="filter-${type.toLowerCase()}"
    class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
    value="${type.toLowerCase()}" ${isFirst ? 'checked' : ''}>

    <label class="trip-filters__filter-label" for="filter-${type.toLowerCase()}">${type}</label>
  </div>
`;

const createFilterTemplate = (filters) => `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('')}
  </form>
`;

export default class FilterView extends AbstractView {
  #filters = [];

  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
