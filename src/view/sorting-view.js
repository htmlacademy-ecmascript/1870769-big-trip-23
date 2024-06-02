import AbstractView from '../framework/view/abstract-view.js';

const createSortingItemTeamplate = (sortType, isChecked) => {
  const DISABLE_TYPE = ['offers', 'event'];

  return `
 <div class="trip-sort__item  trip-sort__item--${sortType.toLowerCase()}">
   <input id="sort-${sortType.toLowerCase()}"
   class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
   value="sort-${sortType.toLowerCase()}" ${isChecked ? 'checked' : ''}
   ${DISABLE_TYPE.includes(sortType) ? 'disabled' : ''}
   >

   <label class="trip-sort__btn" for="sort-${sortType.toLowerCase()}">${sortType}</label>
 </div>`;
};

const createSortingTeamplate = (sortTypes) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortTypes.map((type, index) => createSortingItemTeamplate(type, index === 0)).join('')}
  </form>
 `;

export default class SortingView extends AbstractView{
  #sortTypes = null;
  #handleSortTypeChange = null;

  constructor({ sortTypes, onSortTypeChange }) {
    super();
    this.#sortTypes = sortTypes;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#onSortingTypeChange);
  }

  get template() {
    return createSortingTeamplate(this.#sortTypes);
  }

  removeElement() {
    this.element.removeEventListener('change', this.#onSortingTypeChange);
    super.removeElement();
  }

  #onSortingTypeChange = (evt) => {
    const TargetValue = evt.target.value.split('-');
    this.#handleSortTypeChange(TargetValue[1].toUpperCase());
  };
}
