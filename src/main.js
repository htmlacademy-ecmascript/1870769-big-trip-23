import Presenter from './presenter/presenter.js';
import { TripEventModel } from './model/trip-event-model.js';

const tripEventsModel = new TripEventModel();

const generalPresenter = new Presenter({ tripEventsModel });
generalPresenter.init();
