import MainPresenter from './presenter/main-presenter.js';
import { TripEventModel } from './model/trip-event-model.js';

const tripEventsModel = new TripEventModel();

const generalPresenter = new MainPresenter({ tripEventsModel });

generalPresenter.init();
