import { getId, getRandomInt, getRandomArrayElement } from '../utils.js';

const tripOffers = ['Travel by train', 'Choose seats', 'Add meal', 'Switch to comfort', 'Add luggage'];

const createTripOffer = () => ({
  id: getId(),
  title: getRandomArrayElement(tripOffers),
  price: getRandomInt(300),
});

const offers = new Array(6).fill(null).map(createTripOffer);

export { offers };
