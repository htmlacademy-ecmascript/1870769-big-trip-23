import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const TRIP_EVENT_TYPE = [
  'Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'
];

const DateFormats = {
  DATE_MONTH: 'MMM D',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATE_TIME_SYSTEM: 'YYYY-MM-DDTHH:mm',
  DATE_TIME: 'YY/MM/DD',
  DAY: 'DD[d] HH[h] mm[m]',
  HOURS: 'HH[h] mm[m]',
  MINUTES: 'mm[m]',
  FLATPICKR: 'd/m/y h:m',
};

const DefaultFlatpickrConfig = {
  dateFormat: DateFormats.FLATPICKR,
  enableTime: true,
};

const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const Filters = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortInputTypes = [
  { type: SortTypes.DAY, sortable: true },
  { type: SortTypes.EVENT, sortable: false },
  { type: SortTypes.TIME, sortable: true },
  { type: SortTypes.PRICE, sortable: true },
  { type: SortTypes.OFFER, sortable: false },
];


const NoTripEventMessages = {
  [Filters.EVERYTHING]: 'Click New Event to create your first point',
  [Filters.FUTURE]: 'There are no future events now',
  [Filters.PRESENT]: 'There are no present events now',
  [Filters.PAST]: 'There are no past events now',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  ERROR: 'ERROR',
};

const DEFAULT_EVENT_TYPE = 'flight';

const dateTo = new Date();
dateTo.setDate(new Date().getDate() + 1);

/** @type {import('./model/trip-event-model').TripEvent} */
const DEFAULT_TRIP_EVENT = {
  type: DEFAULT_EVENT_TYPE,
  destination: '',
  basePrice: 0,
  offers: [],
  isFavorite: false,
  dateFrom: new Date(),
  dateTo,
  id: '',
};

export {
  TRIP_EVENT_TYPE,
  Mode,
  DateFormats,
  DEFAULT_TRIP_EVENT,
  SortTypes,
  Filters,
  NoTripEventMessages,
  DefaultFlatpickrConfig,
  UserAction,
  UpdateType,
  SortInputTypes
};
