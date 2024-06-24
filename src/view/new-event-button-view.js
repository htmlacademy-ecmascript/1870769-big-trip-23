import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewEventButtonView extends AbstractView {
  /** @type {?Function} */
  #handleClick = null;

  /**
   * @param {{ onClick: Function }} params
   */
  constructor({ onClick }) {
    super();

    this.#handleClick = onClick;
    this.element.addEventListener("click", this.#clickHandler);
  }

  get template() {
    return createTripInfoTemplate();
  }

  /**
   * @param {MouseEvent} event
   */
  #clickHandler = (event) => {
    event.preventDefault();

    if (this.#handleClick) {
      this.#handleClick();
    }
  };
}
