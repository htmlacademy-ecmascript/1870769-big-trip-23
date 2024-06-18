import { getDateWithRandomTime, getRandomArrayElement, getId, getRandomBoolean } from '../utils.js';
import { TRIP_EVENT_TYPE } from '../const.js';
import { getRandomInt } from '../utils.js';
import { offers } from './trip-offers-mock.js';
import { destionations } from './trip-destinations-mock.js';

const createTripEventsMock = () => {
  const dateFrom = getDateWithRandomTime();
  const dateTo = getDateWithRandomTime(dateFrom);

  return {
    id: getId(),
    // eslint-disable-next-line camelcase
    base_price: getRandomInt(1500),
    // eslint-disable-next-line camelcase
    date_from: dateFrom,
    // eslint-disable-next-line camelcase
    date_to: dateTo,
    destination: getRandomArrayElement(destionations).id,
    // eslint-disable-next-line camelcase
    is_favorite: getRandomBoolean(),
    offers: offers,
    type: getRandomArrayElement(TRIP_EVENT_TYPE)
  };
};

const tripEvents = new Array(3).fill(null).map(createTripEventsMock);

export { tripEvents };
