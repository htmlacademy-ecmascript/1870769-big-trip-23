import { createElement } from '../render.js';

const createFilterTemplate = () =>
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked disabled>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" disabled>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-present" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="present" disabled>
      <label class="trip-filters__filter-label" for="filter-present">Present</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" disabled>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>
  </form>`;

export default class FilterView {
  getTemplate() {
    return createFilterTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}