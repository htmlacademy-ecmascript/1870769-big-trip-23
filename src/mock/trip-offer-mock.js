import { getRandomArrayElement, getRandomInt } from '../utils.js';

const tripOffers = ['Travel by train', 'Choose seats', 'Add meal', 'Switch to comfort', 'Add luggage'];

const tripOffer = () => ({
  offerTitle: getRandomArrayElement(tripOffers),
  offerPrice: getRandomInt(300),
});

export { tripOffer };
