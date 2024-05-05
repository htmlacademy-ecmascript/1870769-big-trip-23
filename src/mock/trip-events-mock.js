import { getDateWithRandomTime, getRandomArrayElement, getId, getRandomBoolean, getRandomDate } from '../utils.js';
import { TRIP_EVENT_TYPE, DateFormats } from '../const.js';
import { tripOffer } from './trip-offer-mock.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

const CITIES = ['Barcelona', 'Kyoto', 'Cape Town', 'Sydney', 'Venice', 'Rio de Janeiro', 'Dubai', 'Prague'];

dayjs.extend(duration);

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

const createTripEventsMock = () => {
  const {TIME, DATE_MONTH} = DateFormats;

  const timeStart = getDateWithRandomTime();
  const timeEnd = getDateWithRandomTime(timeStart);
  const type = getRandomArrayElement(TRIP_EVENT_TYPE);
  const offers = tripOffer();

  const randomDate = getRandomDate();
  const eventDate = dayjs(randomDate).format(DATE_MONTH);
  const dateFrom = dayjs(timeStart).format(TIME);
  const dateTo = dayjs(timeEnd).format(TIME);
  const eventDuration = dayjs.duration(dayjs(timeEnd).diff(dayjs(timeStart)));
  const durationString = formatDuration(eventDuration);

  return {
    id: getId(),
    eventDate: eventDate,
    type: type,
    eventTitle: {
      destination: type,
      eventCity: getRandomArrayElement(CITIES)
    },
    eventSchedule: {
      dateFrom: dateFrom,
      dateTo: dateTo,
      eventDuration: durationString,
    },
    offers: offers,
    basePrice: offers.offerPrice,
    isFavorite: getRandomBoolean(),
  };
};

export { createTripEventsMock };
