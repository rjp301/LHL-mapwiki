const db = require("../../lib/db");

/**  Get all the Pins which matched with map id
 * @param {string} id The id of the map.
 * @return {Promise<{}>} A promise to the pin.
 **/

const getPinsByMap = (map_id) => {
  const queryString = `SELECT * FROM pins WHERE map_id = $1`;
  const queryValues = [map_id];
  return db
    .query(queryString, queryValues)
    .then((res) => res.rows)
    .catch((err) => console.error(err.stack));
};

/** Delete single pin by id
 *
 * @param {string} id
 * @returns {Promise<{}>}
 *
 */
const deletePin = (id) => {
  const queryString = `
  DELETE FROM pins
  WHERE id = $1
  RETURNING *;`;
  const queryValues = [id];
  return db
    .query(queryString, queryValues)
    .then((res) => res.rows)
    .catch((err) => console.error(err.stack));
};

//Edit pin by the id
const editPin = (id, pin) => {
  const queryString = `
  UPDATE pins
  SET title = $1, description = $2, image_url = $3
  WHERE id = $4
  ;`;
  const queryParam = [pin.title, pin.description, pin.image_url, id];

  return db
    .query(queryString, queryParam)
    .then((res) => res.rows)
    .catch((err) => console.log(err.stack));
};

/** Add new pin to the map
 * @param {string} map_id The id of the map.
 * @param {{ title: string, description: string, image_url: string, lat: number, lng: number}} pin
 * @returns {Promise<{}>}
 **/

// module.exports.addPinToMap = (map_id, pin) => {
//   const keys = Object.keys(pin);
//   const queryString = `
//   INSERT INTO pins (map_id, ${keys.join(", ")})
//   VALUES ($1, ${keys.map((_, i) => `$${i + 2}`).join(", ")})
//   RETURNING *`;
//   const queryValues = [map_id];
//   queryValues.push(...keys.map((i) => pin[i]));
//   return db
//     .query(queryString, queryValues)
//     .then((res) => res.rows[0])
//     .catch((err) => console.error(err.stack));
// };

module.exports.addPinToMap = (pin) => {
  const { map_id, title, description, image_url, latitude, longitude } = pin;

  const queryString = `
    INSERT INTO pins
      (map_id, title, description, image_url, lat, lng)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const queryValues = [Number(map_id), title, description, image_url, latitude, longitude];

  return db
    .query(queryString, queryValues)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log(err.message);
      return null;
    })
};

module.exports = {
  getPinsByMap,
  deletePin,
  editPin,
};
