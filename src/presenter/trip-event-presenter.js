import { render, replace, remove } from '../framework/render.js';
import TripEventsView from '../view/trip-events-view.js';
import EditFormView from '../view/edit-form-view.js';
import { UserAction, UpdateType, Mode } from '../const.js';
import { isDatesEqual, isTripEventHaveOffers } from '../utils.js';

export default class TripEventsPresenter {
  #container = null;
  #openedTripEvent = [];

  /** @type {?TripEventsView} */
  #tripEventView = null;

  /** @type {?EditFormView} */
  #tripEditFormView = null;

  /** @type {?import('../model/trip-event-model.js').TripEvent} */
  #tripEvent = null;
  #allCitiesDestinations = [];
  #offers = [];
  #destinations = [];

  /** @type {?Function} */
  #onViewChange = null;
  /** @type {?(type: string, action: string, tripEvent: import('../model/trip-event-model.js').TripEvent) => void} */
  #handleDataChange = null;
  /** @type {?Function} */
  #escKeydownHandler = null;

  #mode = Mode.DEFAULT;

  constructor({ tripEventsElement, onViewChange, onDataChange }) {
    this.#container = tripEventsElement;
    this.#onViewChange = onViewChange;
    this.#handleDataChange = onDataChange;
  }

  init(tripEvent, allCities, offers, destinations) {
    const prevTripEventView = this.#tripEventView;
    const prevTripEditFormView = this.#tripEditFormView;

    this.#tripEvent = tripEvent;
    this.#allCitiesDestinations = allCities;
    this.#offers = offers;
    this.#destinations = destinations;

    if (this.#tripEvent) {
      this.#tripEventView = new TripEventsView({
        tripEvent: this.#tripEvent,
        destinations: this.#destinations,
        onOpenEdit: this.#onClickOpenEditForm.bind(this),
        onFavoritClick: this.#handleFavoriteClick.bind(this),
      });

      this.#tripEditFormView = new EditFormView({
        tripEvent: this.#tripEvent,
        cities: this.#allCitiesDestinations,
        offers:
          this.#offers.find(({ type }) => type === this.#tripEvent?.type)
            .offers || [],
        allOffers: this.#offers,
        destinations: this.#destinations,
        onSubmitEditForm: this.#onSubmitEditForm,
        onClickCloseEditForm: this.#onClickCloseEditForm.bind(this),
        onClickDeleteEditForm: this.#handleDeleteClick.bind(this),
      });
    }

    if (this.#tripEventView && this.#tripEditFormView && this.#container) {
      if (prevTripEventView === null || prevTripEditFormView === null) {
        render(this.#tripEventView, this.#container);
      }
      if (this.#mode === Mode.DEFAULT && prevTripEventView !== null) {
        replace(this.#tripEditFormView, prevTripEventView);
      }
      if (this.#mode === Mode.EDITING && prevTripEditFormView !== null) {
        replace(this.#tripEventView, prevTripEditFormView);
        this.#mode = Mode.DEFAULT;
      }
    }
  }

  destroy() {
    if (this.#tripEditFormView) {
      remove(this.#tripEditFormView);
    }

    if (this.#tripEventView) {
      remove(this.#tripEventView);
    }
  }

  resetView() {
    if (!this.#tripEditFormView) {
      return;
    }
    if (!this.#tripEvent) {
      return;
    }

    if (this.#openedTripEvent.length > 0) {
      this.#tripEditFormView.reset();
      this.#switchToViewForm();
    }
  }

  setSaving() {
    if (!this.#tripEditFormView) {
      return;
    }
    if (this.#mode === Mode.EDITING) {
      this.#tripEditFormView.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setAborting() {
    if (!this.#tripEventView) {
      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      this.#tripEventView.shake();
      return;
    }

    const resetFormState = () => {
      if (!this.#tripEditFormView) {
        return;
      }
      this.#tripEditFormView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    if (!this.#tripEditFormView) {
      return;
    }
    this.#tripEditFormView.shake(resetFormState);
  }

  setDeleting() {
    if (!this.#tripEditFormView) {
      return;
    }
    if (this.#mode === Mode.EDITING) {
      this.#tripEditFormView.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  #switchToViewForm = () => {
    if (this.#openedTripEvent.length > 0) {
      const [editFormComponent, eventViewComponent] = this.#openedTripEvent;

      if (editFormComponent && eventViewComponent) {
        replace(eventViewComponent, editFormComponent);
        if (this.#escKeydownHandler) {
          // @ts-ignore
          document.removeEventListener('keydown', this.#escKeydownHandler);
          this.#escKeydownHandler = null;
        }
        this.#openedTripEvent = [];
        this.#mode = Mode.DEFAULT;
      }
    }
  };

  #switchToEditForm = () => {
    if (this.#openedTripEvent.length > 0) {
      this.#switchToViewForm();
    }

    if (this.#onViewChange) {
      this.#onViewChange();
    }

    this.#openedTripEvent = [
      this.#tripEditFormView,
      this.#tripEventView,
      this.#onEscKeydown.bind(this),
    ];

    if (this.#tripEditFormView && this.#tripEventView) {
      replace(this.#tripEditFormView, this.#tripEventView);
    }

    this.#escKeydownHandler = this.#onEscKeydown.bind(this);
    // @ts-ignore
    document.addEventListener('keydown', this.#escKeydownHandler);
    this.#mode = Mode.EDITING;
  };

  #onClickOpenEditForm() {
    this.#switchToEditForm();
  }

  /**
   *
   * @param {import('../model/trip-event-model.js').TripEvent} update
   * @returns
   */
  #onSubmitEditForm = (update) => {
    if (!this.#tripEvent) {
      return;
    }
    const isMinorUpdate =
      !isDatesEqual(this.#tripEvent.dateFrom, update.dateFrom) ||
      isTripEventHaveOffers(this.#tripEvent.offers) !==
        isTripEventHaveOffers(update.offers);

    if (this.#handleDataChange === null) {
      return;
    }
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );

    this.#tripEvent = update;
    this.#switchToViewForm();
  };

  #onClickCloseEditForm() {
    if (!this.#tripEditFormView) {
      return;
    }

    this.#tripEditFormView.reset();
    this.#switchToViewForm();
  }

  #onEscKeydown(evt) {
    if (!this.#tripEditFormView) {
      return;
    }

    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#tripEditFormView.reset();
      this.#switchToViewForm();
    }
  }

  #handleDeleteClick(tripEvent) {
    if (!this.#handleDataChange) {
      return;
    }
    this.#handleDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      tripEvent
    );
    this.#switchToViewForm();
  }

  /**
   * @param {import('../model/trip-event-model.js').TripEvent} value
   * @returns {void}
   */
  #handleFavoriteClick(value) {
    if (!this.#handleDataChange) {
      return;
    }

    this.#handleDataChange(UserAction.UPDATE_EVENT, UpdateType.MINOR, value);
    this.#switchToViewForm();
  }
}
