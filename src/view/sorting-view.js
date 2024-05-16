import AbstractView from '../framework/view/abstract-view.js';

const createSortingItemTeamplate = (sortType, isFirst) => `
 <div class="trip-sort__item  trip-sort__item--${sortType.toLowerCase()}">
   <input id="sort-${sortType.toLowerCase()}"
   class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
   value="sort-${sortType.toLowerCase()}" ${isFirst ? 'checked' : ''}>

   <label class="trip-sort__btn" for="sort-${sortType.toLowerCase()}">${sortType}</label>
 </div>`;

const createSortingTeamplate = (sortType) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortType.map((type, index) => createSortingItemTeamplate(type, index === 0)).join('')}
  </form>
 `;

export default class SortingView extends AbstractView{
  #sortTypes = [];

  constructor({ sortTypes }) {
    super();
    this.#sortTypes = sortTypes;
  }

  get template() {
    return createSortingTeamplate(this.#sortTypes);
  }
}
