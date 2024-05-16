import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];
const getRandomBoolean = () => Math.random() < 0.5;
const getRandomInt = (max) => Math.round(Math.random() * max);
const getId = () => `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
const getDateWithRandomTime = (date) => dayjs(date).add(getRandomInt(500000), 'minute');

const getRandomDate = () => {
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthIndex = getRandomInt(11);
  const day = getRandomInt(28);
  const month = monthNames[monthIndex];
  const date = `${month} ${day}`;
  return date;
};

export {
  getRandomArrayElement,
  getRandomBoolean,
  getRandomInt,
  getId,
  getDateWithRandomTime,
  getRandomDate
};

