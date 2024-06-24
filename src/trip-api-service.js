import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class TripApiService extends ApiService {
  /**
   * @returns {Promise<Array<TripEvent>>}
   */
  get points() {
    return this._load({ url: "points" }).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: "offers" }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: "destinations" }).then(ApiService.parseResponse);
  }

  /**
   * @param {TripEvent} point
   * @returns {Promise<TripEvent>}
   */
  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: "points",
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(points) {
    const adaptedPoints = {
      ...points,
      base_price: points.basePrice,
      date_from: points.dateFrom,
      date_to: points.dateTo,
      is_favorite: points.isFavorite,
    };

    delete adaptedPoints.basePrice;
    delete adaptedPoints.dateFrom;
    delete adaptedPoints.dateTo;
    delete adaptedPoints.isFavorite;

    return adaptedPoints;
  }
}

/**
 * @typedef {'taxi' |
 *  'bus'           |
 *  'train'         |
 *  'ship'          |
 *  'drive'         |
 *  'flight'        |
 *  'check-in'      |
 *  'sightseeing'   |
 *  'restaurant'
 * } TripEventType
 *
 * @typedef {{
 *  id: string,
 *  base_price: number,
 *  date_from: string,
 *  date_to: string,
 *  destination: string,
 *  is_favorite: boolean,
 *  offers: Array<string>,
 *  type: TripEventType
 * }} TripEvent
 */
