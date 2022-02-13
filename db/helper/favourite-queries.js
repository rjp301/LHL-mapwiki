const db = require("../../lib/db");

/**
 * Add a map to an user's favourites.
 * @param {string} user_id The id of the user.
 * @param {string} map_id The id of the map.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports.addMapToFavourites = (user_id, map_id) => {
  const queryString = `
  INSERT INTO favourites (user_id, map_id)
  VALUES ($1, $2)
  RETURNING *;
  `;
  const queryValues = [user_id, map_id];
  return db
    .query(queryString, queryValues)
    .then((response) => response.rows[0])
    .catch((err) => console.error(err.stack));
};

/**
 * Remove a map from an user's favourites.
 * @param {string} user_id The id of the user.
 * @param {string} map_id The id of the map.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports.removeMapFromFavourites = (user_id, map_id) => {
  const queryString = `
  DELETE FROM favourites
  WHERE user_id = $1
  AND map_id = $2
  RETURNING *;
  `;
  const queryValues = [user_id, map_id];
  return db
    .query(queryString, queryValues)
    .then((response) => response.rows[0])
    .catch((err) => console.error(err.stack));
};
