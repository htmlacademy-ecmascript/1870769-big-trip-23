import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];
const getRandomBoolean = () => Math.random() < 0.5;
const getRandomInt = (max) => Math.round(Math.random() * max);
const getId = () => `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
const getDateWithRandomTime = (date) => dayjs(date).add(getRandomInt(5000), 'minute');

const getRandomDate = () => {
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthIndex = getRandomInt(11);
  const day = getRandomInt(28);
  const month = monthNames[monthIndex];
  const date = `${month} ${day}`;
  return date;
};

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

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

export {
  getRandomArrayElement,
  getRandomBoolean,
  getRandomInt,
  getId,
  getDateWithRandomTime,
  getRandomDate,
  updateItem,
  sortingEventsByDate,
  sortingEventsByPrice,
  sortingEventsByTime
};

