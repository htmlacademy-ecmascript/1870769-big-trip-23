import { getRandomArrayElement, getId } from '../utils.js';

const CITIES = ['Barcelona', 'Kyoto', 'Cape Town', 'Sydney', 'Venice', 'Rio de Janeiro', 'Dubai', 'Prague'];

const createPicture = (city) => ({
  src: `https://loremflickr.com/248/152/${city.toLowerCase().replace(/\s+/g, '-')}`,
  description: `${city} photo description`
});

const createDestinationsMock = () => {
  const city = getRandomArrayElement(CITIES);
  return{
    id: getId(),
    name: city,
    picture: createPicture(city),
    description: `${city}, there should be a description of the city`
  };
};

const destionations = new Array(CITIES.length).fill(null).map(createDestinationsMock);

export { destionations };