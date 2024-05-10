import AbstractView from '../framework/view/abstract-view.js';

const FILTER_TYPES = ['Everything', 'Future', 'Present', 'Past'];

const createFilterItemTemplate = (type, isFirst) => `
  <div class="trip-filters__filter">
    <input
    id="filter-${type.toLowerCase()}"
    class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
    value="${type.toLowerCase()}" ${isFirst ? 'checked' : ''} disabled>

    <label class="trip-filters__filter-label" for="filter-${type.toLowerCase()}">${type}</label>
  </div>
`;

const createFilterTemplate = () => `
  <form class="trip-filters" action="#" method="get">
    ${FILTER_TYPES.map((type, index) => createFilterItemTemplate(type, index === 0)).join('')}
  </form>
`;

export default class FilterView extends AbstractView {
  get template() {
    return createFilterTemplate();
  }
}
