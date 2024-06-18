import TripEventModel from './model/trip-event-model.js';
import FilterModel from './model/filter-model.js';
import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventButtonView from './view/new-event-button-view.js';
import { render } from './framework/render.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const tripEventsModel = new TripEventModel();
const filterModel = new FilterModel();

const generalPresenter = new MainPresenter({ tripEventsModel, tripEventsContainer, filterModel, onNewTaskDestroy: handleNewListElementFormClose });
const filterPresenter = new FilterPresenter({ tripEventsModel, filterModel, filterContainer });

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick
});

function handleNewListElementFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  generalPresenter.createListElement();
  newEventButtonComponent.element.disabled = true;
}

render(newEventButtonComponent, document.querySelector('.trip-main'));

filterPresenter.init();
generalPresenter.init();
