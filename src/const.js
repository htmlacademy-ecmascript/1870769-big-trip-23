const DEFAULT_EVENT_TYPE = 'Flight';

const DEFAULT_TRIP_EVENT = {
  type: DEFAULT_EVENT_TYPE,
  dateFrom: '',
  dateTo: '',
  destination: '',
  price: 0,
  offers: [],
  isFavorite: false,
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
  FLATPICKR: 'D/M/Y h:m',
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

const NoTripEventMessages = {
  [Filters.EVERYTHING]: 'Click New Event to create your first point',
  [Filters.FUTURE]: 'There are no past events now',
  [Filters.PRESENT]: 'There are no present events now',
  [Filters.PAST]: 'There are no future events now',
};

export {
  TRIP_EVENT_TYPE,
  DateFormats,
  DEFAULT_TRIP_EVENT,
  SortTypes,
  Filters,
  NoTripEventMessages,
  DefaultFlatpickrConfig
};
