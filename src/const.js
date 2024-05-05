const DEFAULT_EVENT_TYPE = 'Flight';

const TRIP_EVENT_TYPE = [
  'Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'
];

const DateFormats = {
  DATE_MONTH: 'MMM D',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATE_TIME_SYSTEM: 'YYYY-MM-DDTHH:mm',
  DATE_TIME: 'YY/MM/DD HH:mm',
  DAY: 'DD[d] HH[h] mm[m]',
  HOURS: 'HH[h] mm[m]',
  MINUTES: 'mm[m]'
};

const DEFAULT_TRIP_EVENT = {
  type: DEFAULT_EVENT_TYPE,
  dateFrom: new Date(),
  dateTo: null,
  destination: null,
  price: 0,
  offers: [],
  isFavorite: false,
};

export {
  TRIP_EVENT_TYPE,
  DateFormats,
  DEFAULT_TRIP_EVENT
};
