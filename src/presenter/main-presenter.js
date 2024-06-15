import { render, RenderPosition, remove } from '../framework/render.js';
import TripEventPresenter from './trip-event-presenter.js';
import SortingView from '../view/sorting-view.js';
import FilterView from '../view/filter-view.js';
import NoTripEventsView from '../view/no-trip-events-view.js';
import { SortTypes, UpdateType, UserAction, Filters } from '../const.js';
import {
  sortingEventsByDate,
  sortingEventsByPrice,
  sortingEventsByTime,
  // updateItem
} from '../utils.js';

export default class MainPresenter {
  #currentSortType = SortTypes.DAY;

  #tripEventsPresentersMap = new Map();
  #sortingView = null;
  #noTripEventsView = null;

  #cities = [];
  #offers = [];
  #filterType = Filters.EVERYTHING;
  #destinations = [];

  constructor({ tripEventsModel }) {
    this.tripFilterElement = document.querySelector('.trip-controls__filters');
    this.tripEventsElement = document.querySelector('.trip-events');

    this.tripEventsListElement = document.createElement('ul');
    this.tripEventsListElement.classList.add('trip-events__list');
    this.tripEventsElement.appendChild(this.tripEventsListElement);

    this.tripEventsModel = tripEventsModel;
    this.#cities = tripEventsModel.allCities;
    this.#offers = tripEventsModel.offers;
    this.#destinations = tripEventsModel.destinations;

    this.tripEventsModel.addObserver(this.#handleModelEvent);
  }

  get tripEvents() {
    switch (this.#currentSortType.toLowerCase()) {
      case SortTypes.TIME:
        return this.tripEventsModel.tripEvents.toSorted(sortingEventsByTime);
      case SortTypes.PRICE:
        return this.tripEventsModel.tripEvents.toSorted(sortingEventsByPrice);
      default:
        return this.tripEventsModel.tripEvents.toSorted(sortingEventsByDate);
    }
  }

  init() {
    this.#clearTripEventsList();

    this.#renderFilterView(this.tripEventsModel);
    this.#renderSortingView(this.tripEventsModel);
    this.#renderTripEvents();
  }

  #renderFilterView({ filters }) {
    render(new FilterView({ filters }), this.tripFilterElement, RenderPosition.BEFOREBEGIN);
  }

  #renderSortingView({ sortTypes }) {
    this.#sortingView = new SortingView({
      sortTypes: sortTypes,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(
      this.#sortingView,
      this.tripEventsElement,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderTripEvents() {
    const cities = this.#cities;
    const offers = this.#offers;
    const destinations = this.#destinations;

    if (this.tripEvents.length === 0) {
      this.#renderNoTripEventsView();
      return;
    }

    this.tripEvents.forEach((tripEvent) => this.#renderTripEvent(tripEvent, cities, offers, destinations));
  }

  #renderTripEvent(tripEvent, cities, offers, destinations) {
    const tripEventPresenter = new TripEventPresenter({
      tripEventsElement: this.tripEventsListElement,
      onViewChange: this.#handleViewChange.bind(this),
      onDataChange: this.#handleViewAction
    });

    tripEventPresenter.init(tripEvent, cities, offers, destinations);
    this.#tripEventsPresentersMap.set(tripEvent.id, tripEventPresenter);
  }

  #renderNoTripEventsView() {
    const filters = this.tripEventsModel.filters || [];
    this.#noTripEventsView = new NoTripEventsView({ filters: filters[0] });

    render(this.#noTripEventsView, this.tripEventsElement, RenderPosition.BEFOREEND);
  }

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearTripEventsList();
    this.#handleModelEvent(UpdateType.MINOR);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType) {
      case UserAction.UPDATE_EVENT:
        this.tripEventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.tripEventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.tripEventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#tripEventsPresentersMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripEventsList();
        this.#renderTripEvents();
        break;
      case UpdateType.MAJOR:
        this.#clearTripEventsList({ clearTripEventsList: true });
        this.#renderTripEvents();
        break;
    }
  };

  #clearTripEventsList({ resetSortType = false } = {}) {
    this.#tripEventsPresentersMap.forEach((presenter) => presenter.destroy());
    this.#tripEventsPresentersMap.clear();

    if (this.#noTripEventsView) {
      remove(this.#noTripEventsView);
    }

    if(resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }
  }

  #handleViewChange = () => {
    this.#tripEventsPresentersMap.forEach((presenter) => presenter.resetView());
  };
}

