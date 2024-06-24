import dayjs from 'dayjs';
import { Filters } from './const.js';

const getWeightForNullDate = (dateA, dateB) => {
  if (!dateA && !dateB) {
    return 0;
  }
  if (!dateA) {
    return 1;
  }
  if (!dateB) {
    return -1;
  }
  return null;
};

const sortingEventsByDate = (tripA, tripB) => {
  const weight = getWeightForNullDate(tripA.eventDate, tripB.eventDate);

  return weight ?? dayjs(tripA.eventDate).diff(dayjs(tripB.eventDate));
};

const sortingEventsByPrice = (tripA, tripB) => tripB.basePrice - tripA.basePrice;

const sortingEventsByTime = (tripA, tripB) => tripB.durationInMinutes - tripA.durationInMinutes;

const isTripEventHaveOffers = (tripEvent) => tripEvent.length !== 0;
const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const isListElementFuture = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'D');
const isListElementPresent = (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');
const isListElementPast = (dueDate) => dueDate && dayjs().isBefore(dueDate, 'D');
const filter = {
  [Filters.EVERYTHING]: (tripEvents) => tripEvents,
  [Filters.FUTURE]: (tripEvents) => tripEvents.filter((tripEvent) => isListElementFuture(tripEvent.eventDate)),
  [Filters.PRESENT]: (tripEvents) => tripEvents.filter((tripEvent) => isListElementPresent(tripEvent.eventDate)),
  [Filters.PAST]: (tripEvents) => tripEvents.filter((tripEvent) => isListElementPast(tripEvent.eventDate)),
};

const formatDuration = (stopDuration) => {
  const days = stopDuration.days();
  const hours = stopDuration.hours();
  const minutes = stopDuration.minutes();

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  } else {
    return `${minutes}M`;
  }
};

const calculateEventDuration = (dateFrom, dateTo) => {
  const durationInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  const minutes = durationInMinutes % 60;
  const hours = Math.floor(durationInMinutes / 60) % 24;
  const days = Math.floor(durationInMinutes / 1440);

  if (days > 0) {
    return `${days}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else {
    return `${minutes}M`;
  }
};

export {
  sortingEventsByDate,
  sortingEventsByPrice,
  sortingEventsByTime,
  isDatesEqual,
  isTripEventHaveOffers,
  filter,
  formatDuration,
  calculateEventDuration
};

