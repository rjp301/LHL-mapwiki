const { del } = require("express/lib/application");

const db = require("../../lib/db");

/**  Get all the Pins which matched with map id
 * @param {string} id The id of the map.
 * @return {Promise<{}>} A promise to the pin.
 **/

const getPins = (id) => {
  const queryString = `SELECT * FROM pins WHERE map_id = $1`;
  const queryParams = [id];
  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((err) => {
      console.log(`getPin Error : ${err.message}`);
    });
};

/** Add new pin to the map
 * @param {string} id The id of the map.
 * @param {{ title: string, description: string, image_url: string, lat: number, lng: number}} pin
 * @returns {Promise<{}>}
 **/

const addPin = (pin) => {
  const queryString = `
  INSERT INTO pins (title, description, image_url, lat, lng)
   VALUES ($1, $2, $3, $4, $5 )
   RETURNING *`;
  const queryParams = [
    pin.title,
    pin.description,
    pin.image_url,
    pin.lat,
    pin.lng,
  ];
  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows[0];
    })
    .catch((err) => {
      console.log(`addPin Error : ${err.message}`);
    });
};

/** Delete single pin by id
 *
 * @param {string} id
 * @returns {Promise<{}>}
 *
 */
const deletePin = (id) => {
  const queryString = `DELETE FROM pins WHERE id = $1 `;
  const queryPamras = [id];
  db.query(queryString, queryPamras)
    .then((response) => {
      return response.rows[0];
    })
    .catch((err) => {
      console.log(`deletePin Error : ${err.mesage}`);
    });
};

module.exports = {
  getPins,
  addPin,
  deletePin,
};
