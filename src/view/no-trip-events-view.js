import AbstractView from '../framework/view/abstract-view.js';
import { NoTripEventMessages } from '../const.js';

const createEmptyTemplate = (filters) => `<p class="trip-events__msg">${NoTripEventMessages[filters]}</p>`;

export default class NoTripEventsView extends AbstractView {
  #filters = '';

  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createEmptyTemplate(this.#filters);
  }
}
