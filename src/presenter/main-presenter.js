import { render, RenderPosition, remove } from '../framework/render.js';
import TripEventPresenter from './trip-event-presenter.js';
import NewTripEventPresenter from './new-trip-event-presenter.js';
import SortingView from '../view/sorting-view.js';
import NoTripEventsView from '../view/no-trip-events-view.js';
import LoadingView from '../view/loading-view.js';
import { SortTypes, UpdateType, UserAction, Filters } from '../const.js';
import {
  sortingEventsByDate,
  sortingEventsByPrice,
  sortingEventsByTime,
  filter
} from '../utils.js';

export default class MainPresenter {
  #tripEventsPresentersMap = new Map();
  #newTripEventPresenter = null;

  #currentSortType = SortTypes.DAY;
  #loadingElement = new LoadingView();

  #tripEventsModel = null;
  #filterModel = null;
  #tripEventsElement = null;
  #tripEventsListElement = null;

  #isLoading = true;
  #filterType = Filters.EVERYTHING;
  #sortingView = null;
  #noTripEventsView = null;

  #cities = [];
  #offers = [];
  #destinations = [];

  constructor({ tripEventsModel, tripEventsContainer, filterModel, onNewTaskDestroy }) {
    this.#tripEventsElement = tripEventsContainer;

    this.#tripEventsListElement = document.createElement('ul');
    this.#tripEventsListElement.classList.add('trip-events__list');
    this.#tripEventsElement.appendChild(this.#tripEventsListElement);

    this.#tripEventsModel = tripEventsModel;
    this.#filterModel = filterModel;

    this.#newTripEventPresenter = new NewTripEventPresenter({
      container: this.#tripEventsElement,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewTaskDestroy
    });

    this.#cities = tripEventsModel.allCities;
    this.#offers = tripEventsModel.offers;
    this.#destinations = tripEventsModel.destinations;

    this.#tripEventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get tripEvents() {
    this.#filterType = this.#filterModel.filters;
    const tripEvents = this.#tripEventsModel.tripEvents.toSorted(sortingEventsByDate);
    const filteredTripEvents = filter[this.#filterType](tripEvents);

    switch (this.#currentSortType.toLowerCase()) {
      case SortTypes.TIME:
        return filteredTripEvents.toSorted(sortingEventsByTime);
      case SortTypes.PRICE:
        return filteredTripEvents.toSorted(sortingEventsByPrice);
    }

    return filteredTripEvents;
  }

  init() {
    this.#clearTripEventsList();

    this.#renderSortingView(this.#tripEventsModel);
    this.#renderTripEvents();
  }

  createListElement() {
    this.#currentSortType = SortTypes.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, Filters.EVERYTHING);
    this.#newTripEventPresenter.init(this.#tripEventsModel);

    if (this.tripEvents.length === 0) {
      this.#clearTripEventsList();
      return;
    }

    this.#clearTripEventsList();
    this.#renderTripEvents();
  }

  #renderSortingView({ sortTypes }) {
    this.#sortingView = new SortingView({
      sortTypes: sortTypes,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(
      this.#sortingView,
      this.#tripEventsElement,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderTripEvents() {
    const cities = this.#cities;
    const offers = this.#offers;
    const destinations = this.#destinations;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.tripEvents.length === 0) {
      this.#renderNoTripEventsView();
      return;
    }

    this.tripEvents.forEach((tripEvent) => this.#renderTripEvent(tripEvent, cities, offers, destinations));
  }

  #renderTripEvent(tripEvent, cities, offers, destinations) {
    const tripEventPresenter = new TripEventPresenter({
      tripEventsElement: this.#tripEventsListElement,
      onViewChange: this.#handleViewChange.bind(this),
      onDataChange: this.#handleViewAction
    });

    tripEventPresenter.init(tripEvent, cities, offers, destinations);
    this.#tripEventsPresentersMap.set(tripEvent.id, tripEventPresenter);
  }

  #renderNoTripEventsView() {
    const filters = this.#filterModel.filters || [];
    this.#noTripEventsView = new NoTripEventsView({ filters: filters });

    render(this.#noTripEventsView, this.#tripEventsElement, RenderPosition.BEFOREEND);
  }

  #renderLoading() {
    render(this.#loadingElement, this.#tripEventsElement.element, RenderPosition.AFTERBEGIN);
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
        this.#tripEventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#tripEventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#tripEventsModel.deleteEvent(updateType, update);
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingElement);
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
    remove(this.#loadingElement);

    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }
  }

  #handleViewChange = () => {
    this.#tripEventsPresentersMap.forEach((presenter) => presenter.resetView());
  };
}

