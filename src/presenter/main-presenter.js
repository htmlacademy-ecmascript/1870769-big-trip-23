import { render, RenderPosition } from '../framework/render.js';
import TripEventPresenter from './trip-event-presenter.js';
import SortingView from '../view/sorting-view.js';
import FilterView from '../view/filter-view.js';
import NoTripEventsView from '../view/no-trip-events-view.js';
import { SortTypes } from '../const.js';
import {
  sortingEventsByDate,
  sortingEventsByPrice,
  sortingEventsByTime,
  updateItem
} from '../utils.js';

export default class MainPresenter {
  #currentSortType = SortTypes.DAY;
  #tripEventPresenterMap = new Map();
  #tripEvents = [];
  #cities = [];
  #offers = [];
  #destinations = [];

  constructor({ tripEventsModel }) {
    this.tripFilterElement = document.querySelector('.trip-controls__filters');
    this.tripEventsElement = document.querySelector('.trip-events');

    this.tripEventsListElement = document.createElement('ul');
    this.tripEventsListElement.classList.add('trip-events__list');
    this.tripEventsElement.appendChild(this.tripEventsListElement);

    this.tripEventsModel = tripEventsModel;
    this.#tripEvents = tripEventsModel.tripEvents;
    this.#cities = tripEventsModel.allCities;
    this.#offers = tripEventsModel.offers;
    this.#destinations = tripEventsModel.destinations;
  }

  init() {
    this.#clearTripEventsList();

    this.#renderFilterView(this.tripEventsModel);
    this.#renderSortingView(this.tripEventsModel);
    this.#renderTripEvents();
  }

  get tripEevent() {
    return this.#tripEvents;
  }

  #renderFilterView({ filters }) {
    render(new FilterView({ filters }), this.tripFilterElement, RenderPosition.BEFOREBEGIN);
  }

  #renderSortingView({ sortTypes }) {
    render(
      new SortingView({
        sortTypes: sortTypes,
        onSortTypeChange: this.#handleSortTypeChange
      }),
      this.tripEventsElement,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderTripEvents() {
    const cities = this.#cities;
    const offers = this.#offers;
    const destinations = this.#destinations;

    if (this.#tripEvents.length === 0) {
      this.#renderNoTripEventsView();
      return;
    }

    this.#tripEvents.forEach((tripEvent) => this.#renderTripEvent(tripEvent, cities, offers, destinations));
  }

  #renderTripEvent(tripEvent, cities, offers, destinations) {
    const tripEventPresenter = new TripEventPresenter({
      tripEventsElement: this.tripEventsListElement,
      onViewChange: this.#handleViewChange.bind(this),
      onFavoriteClick: this.#handleFavoriteClick.bind(this)
    });

    tripEventPresenter.init(tripEvent, cities, offers, destinations);
    this.#tripEventPresenterMap.set(tripEvent.id, tripEventPresenter);
  }

  #renderNoTripEventsView() {
    const filters = this.tripEventsModel.tripEvent.filters || [];
    render(new NoTripEventsView({ filters: filters[0] }), this.tripEventsElement, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearTripEventsList();
    this.#sortType(this.#currentSortType);
    this.#renderTripEvents();
  };

  #sortType(sortType) {
    switch (sortType.toLowerCase()) {
      case SortTypes.TIME:
        this.#tripEvents.sort(sortingEventsByTime);
        break;
      case SortTypes.PRICE:
        this.#tripEvents.sort(sortingEventsByPrice);
        break;
      default:
        this.#tripEvents.sort(sortingEventsByDate);
    }
  }

  #clearTripEventsList() {
    this.#tripEventPresenterMap.forEach((presenter) => presenter.destroy());
    this.#tripEventPresenterMap.clear();
    this.tripEventsListElement.innerHTML = '';
  }

  #handleViewChange = () => {
    this.resetTripEventsView();
  };

  #handleFavoriteClick = (tripEvent) => {
    const updatedEvent = { ...tripEvent, isFavorite: !tripEvent.isFavorite };
    this.#tripEvents = updateItem(this.#tripEvents, updatedEvent);

    this.#clearTripEventsList();
    this.#renderTripEvents();
  };

  resetTripEventsView() {
    this.#tripEventPresenterMap.forEach((presenter) => presenter.resetView());
  }
}

