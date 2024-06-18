import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, count} = filter;

  return (`
  <div class="trip-filters__filter">
    <input
    id="filter-${type}"
    class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
    value="${type}" ${type === currentFilterType ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}>

    <label class="trip-filters__filter-label" for="filter-${type}" data-count="${count}">${type}</label>
  </div>
`);
};

const createFilterTemplate = (filters, currentFilterType) => `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('')}
  </form>
`;

export default class FilterView extends AbstractView {
  #filters = [];
  #handleFilterTypeChange = null;
  #currentFilterType = null;

  constructor({ filters, onFilterTypeChange, currentFilterType }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.dataset.count === '0') {
      return;
    }

    this.#handleFilterTypeChange(evt.target.textContent);
  };
}
