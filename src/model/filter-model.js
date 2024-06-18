import Observable from '../framework/observable.js';
import { Filters } from '../const.js';

export default class FilterModel extends Observable {
  #filters = Filters.EVERYTHING;

  get filters() {
    return this.#filters;
  }

  setFilter(updateType, filter) {
    this.#filters = filter;
    this._notify(updateType, filter);
  }
}
