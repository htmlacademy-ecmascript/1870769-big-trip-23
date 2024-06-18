import TripEventModel from './model/trip-event-model.js';
import FilterModel from './model/filter-model.js';
import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventButtonView from './view/new-event-button-view.js';
import TripApiService from './trip-api-service.js';
import { render } from './framework/render.js';

const AUTHORIZATION = 'Basic kK7a2r3p8';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const tripEventsModel = new TripEventModel({ tripApiService: new TripApiService(END_POINT, AUTHORIZATION) });
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
  newEventButtonComponent.element.disabled = true;
  generalPresenter.createListElement();
}

filterPresenter.init();
generalPresenter.init();
tripEventsModel.init()
  .finally(() => {
    render(newEventButtonComponent, document.querySelector('.trip-main'));
  });
