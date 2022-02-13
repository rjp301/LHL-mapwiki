const db = require("../../lib/db");

/**
 * Get a single map from the database given its id.
 * @param {string} user_id The id of the user.
 * @param {string} map_id The id of the map.
 * @return {Promise<{}>} A promise to the user.
 */
 module.exports.addMapToFavourites = (user_id, map_id) => {
  const queryString = `
  INSERT INTO favourites (user_id, map_id)
  VALUES ($1, $2)
  `;
  const queryValues = [user_id, map_id];
  return db
    .query(queryString, queryValues)
    .then((response) => response.rows[0])
    .catch((err) => console.error(err.stack));
};

module.exports.removeMapFromFavourites = (user_id, map_id) => {
  const queryString = `
  DELETE FROM favourites
  WHERE user_id = $1
  AND map_id = $2
  `;
  const queryValues = [user_id, map_id];
  return db
    .query(queryString, queryValues)
    .then((response) => response.rows[0])
    .catch((err) => console.error(err.stack));
};
