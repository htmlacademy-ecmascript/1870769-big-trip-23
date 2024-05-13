import AbstractView from '../framework/view/abstract-view.js';

const SORT_TYPES = ['Day', 'Event', 'Time', 'Price', 'Offers'];

const createSortingItemTeamplate = (type, isFirst) => `
 <div class="trip-sort__item  trip-sort__item--${type.toLowerCase()}">
   <input id="sort-${type.toLowerCase()}"
   class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
   value="sort-${type.toLowerCase()}" ${isFirst ? 'checked' : ''}>
   
   <label class="trip-sort__btn" for="sort-${type.toLowerCase()}">${type}</label>
 </div>`;

const createSortingTeamplate = () => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${SORT_TYPES.map((type, index) => createSortingItemTeamplate(type, index === 0)).join('')}
  </form>
 `;

export default class SortingView extends AbstractView{
  get template() {
    return createSortingTeamplate();
  }
}
