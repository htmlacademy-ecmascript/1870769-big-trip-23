import { getId, getRandomInt, getRandomArrayElement, getRandomBoolean } from '../utils.js';

const tripOffers = ['Travel by train', 'Choose seats', 'Add meal', 'Switch to comfort', 'Add luggage'];

const createTripOffer = () => ({
  id: getId(),
  title: getRandomArrayElement(tripOffers),
  price: getRandomInt(500),
  isChecked: getRandomBoolean(),
});

const offers = new Array(4).fill(null).map(createTripOffer);

export { offers };
