import { render, RenderPosition, remove } from '../framework/render.js';
import TripEventPresenter from './trip-event-presenter.js';
import NewTripEventPresenter from './new-trip-event-presenter.js';
import SortingView from '../view/sorting-view.js';
import NoTripEventsView from '../view/no-trip-events-view.js';
import LoadingView from '../view/loading-view.js';
import { SortTypes, UpdateType, UserAction, Filters } from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {
  sortingEventsByDate,
  sortingEventsByPrice,
  sortingEventsByTime,
  filter
} from '../utils.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class MainPresenter {
  #tripEventsPresentersMap = new Map();

  /** @type {?NewTripEventPresenter} */
  #newTripEventPresenter = null;

  #currentSortType = SortTypes.DAY;
  #loadingElement = new LoadingView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  /** @type {?import('../model/trip-event-model.js').default} */
  #tripEventsModel = null;

  /** @type {?import('../model/filter-model.js').default} */
  #filterModel = null;

  /** @type {?HTMLElement} */
  #tripEventsElement = null;

  /** @type {?HTMLElement} */
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
    this.#tripEventsElement?.appendChild(this.#tripEventsListElement);

    this.#tripEventsModel = tripEventsModel;
    this.#filterModel = filterModel;

    this.#newTripEventPresenter = new NewTripEventPresenter({
      container: this.#tripEventsElement,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewTaskDestroy
    });

    if (this.#tripEventsModel) {
      this.#cities = this.#tripEventsModel.allCities;
      this.#offers = this.#tripEventsModel.offers;
      this.#destinations = this.#tripEventsModel.destinations;

      this.#tripEventsModel.addObserver(this.#handleModelEvent);
    }

    if (this.#filterModel) {
      this.#filterModel.addObserver(this.#handleModelEvent);
    }
  }

  get tripEvents() {
    if (!this.#tripEventsModel) {
      throw new Error('Model is not defined');
    }

    if (this.#filterModel) {
      this.#filterType = this.#filterModel.filters;
    }

    const tripEvents = this.#tripEventsModel.events.toSorted(sortingEventsByDate);
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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.tripEvents.length === 0) {
      this.#renderNoTripEventsView();
      return;
    }

    this.tripEvents.forEach((tripEvent) => {
      this.#renderTripEvent(tripEvent);
    });
  }

  #renderTripEvent(tripEvent) {
    const tripEventPresenter = new TripEventPresenter({
      tripEventsElement: this.#tripEventsListElement,
      onViewChange: this.#handleViewChange,
      onDataChange: this.#handleViewAction
    });

    tripEventPresenter.init(tripEvent, this.#tripEventsModel?.allCities, this.#tripEventsModel?.offers, this.#tripEventsModel?.destinations);
    this.#tripEventsPresentersMap.set(tripEvent.id, tripEventPresenter);
  }

  #renderNoTripEventsView() {
    if(!this.#filterModel) {
      return;
    }
    const filters = this.#filterModel.filters || [];

    if(!this.#noTripEventsView) {
      return;
    }
    this.#noTripEventsView = new NoTripEventsView({ filters });

    render(this.#noTripEventsView, this.#tripEventsElement, RenderPosition.BEFOREEND);
  }

  #renderLoading() {
    render(this.#loadingElement, this.#tripEventsElement, RenderPosition.BEFOREEND);
  }

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearTripEventsList();
    this.#handleModelEvent(UpdateType.MINOR);
  };

  /**
   *
   * @param {string} actionType
   * @param {*} updateType
   * @param {import('../model/trip-event-model.js').TripEvent} update
   */
  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    if (!this.#tripEventsModel) {
      throw new Error('Model is not defined');
    }

    if (!this.#newTripEventPresenter) {
      throw new Error('New task presenter is not defined');
    }

    switch(actionType) {
      case UserAction.UPDATE_EVENT:
        this.#tripEventsPresentersMap.get(update.id).setSaving();
        try {
          await this.#tripEventsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#tripEventsPresentersMap.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newTripEventPresenter.setSaving();
        try {
          await this.#tripEventsModel.addEvent(updateType, update);
          this.#newTripEventPresenter.removeForm();
        } catch(err) {
          this.#newTripEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        await this.#tripEventsPresentersMap.get(update.id).setDeleting();
        try {
          this.#tripEventsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#tripEventsPresentersMap.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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

