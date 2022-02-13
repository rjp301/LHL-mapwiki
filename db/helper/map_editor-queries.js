const db = require("../../lib/db");

/**
 * Show all contributors of a map.
 * @param {string} id The id of the map.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports.getAllEditorsByMap = (id) => {
  const queryString = `
  SELECT users.name FROM users
  JOIN map_editors ON user_id = users.id
  WHERE map_id = $1
  `;
  const queryValues = [id];
  return db
    .query(queryString, queryValues)
    .then((response) => response.rows)
    .catch((err) => console.error(err.stack));
};

/**
 * Add a contributor to a map.
 * @param {string} user_id The id of the user.
 * @param {string} map_id The id of the map.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports.addMapEditor = (user_id, map_id) => {
  const queryString = `
  INSERT INTO map_editors (user_id, map_id)
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
 * Remove a contributor from a map.
 * @param {string} user_id The id of the user.
 * @param {string} map_id The id of the map.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports.removeMapEditor = (user_id, map_id) => {
  const queryString = `
  DELETE FROM map_editors
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
