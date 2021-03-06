const db = require("../../lib/db");

/**
 * Get all maps from the database.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports.getMaps = () => {
  const queryString = `
  SELECT
    maps.*,
    avg(pins.lat) AS avg_lat,
    avg(pins.lng) AS avg_lng
  FROM maps
  LEFT JOIN pins ON pins.map_id = maps.id
  GROUP BY maps.id
  ORDER BY maps.date_created DESC;`;
  return db
    .query(queryString)
    .then((res) => res.rows)
    .catch((err) => console.error(err.stack));
};

/**
 * Get a single map from the database given its id.
 * @param {string} id The id of the map.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports.getMapById = (id) => {
  const queryString = `
  SELECT
    maps.*,
    avg(pins.lat) AS avg_lat,
    avg(pins.lng) AS avg_lng
  FROM maps
  LEFT JOIN pins ON pins.map_id = maps.id
  WHERE maps.id = $1
  GROUP BY maps.id;`;
  const queryValues = [id];
  return db
    .query(queryString, queryValues)
    .then((res) => res.rows[0])
    .catch((err) => console.error(err.stack));
};

/**
 * Get all maps that have been favourited by user.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports.getFavMapsByUserId = (id) => {
  const queryString = `
  SELECT DISTINCT
    maps.*,
    avg(pins.lat) AS avg_lat,
    avg(pins.lng) AS avg_lng
  FROM maps
  LEFT JOIN pins ON pins.map_id = maps.id
  JOIN favourites ON favourites.map_id = maps.id
  WHERE favourites.user_id = $1
  GROUP BY maps.id
  ORDER BY maps.date_created DESC;`;
  const queryValues = [id];
  return db
    .query(queryString, queryValues)
    .then((res) => res.rows)
    .catch((err) => console.error(err.stack));
};

/**
 * Get all maps that a user can edit.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports.getEditMapsByUserId = (id) => {
  const queryString = `
  SELECT DISTINCT
    maps.*,
    avg(pins.lat) AS avg_lat,
    avg(pins.lng) AS avg_lng
  FROM maps
  LEFT JOIN pins ON pins.map_id = maps.id
  LEFT JOIN map_editors ON map_editors.map_id = maps.id
  WHERE map_editors.user_id = $1
  OR maps.creator_id = $1
  GROUP BY maps.id
  ORDER BY maps.date_created DESC;`;
  const queryValues = [id];
  return db
    .query(queryString, queryValues)
    .then((res) => res.rows)
    .catch((err) => console.error(err.stack));
};

/**
 * Add map to the database.
 * @param {{creator_id: integer, name: string, description: string}} map
 * @return {Promise<{}>} A promise to the user
 */
module.exports.addMap = (map) => {
  const keys = Object.keys(map);
  const nums = keys.map((_, i) => `$${i + 1}`);
  const queryString = `
  INSERT INTO maps (${keys.join(", ")})
  VALUES (${nums.join(", ")})
  RETURNING *;`;
  const queryValues = keys.map((i) => map[i]);
  console.log(queryString);
  return db
    .query(queryString, queryValues)
    .then((res) => res.rows[0])
    .catch((err) => console.error(err.stack));
};

/**
 * Delete map from database.
 * @param {integer} id The id of the map.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports.deleteMap = (id) => {
  const queryString = `
  DELETE FROM maps
  WHERE id = $1
  RETURNING *;`;
  const queryValues = [id];
  return db
    .query(queryString, queryValues)
    .then((res) => res.rows[0])
    .catch((err) => console.error(err.stack));
};

/**
 * Update map information.
 * @param {integer} id Id of the map
 * @param {{creator_id: integer, name: string, description: string}} map
 * @return {Promise<{}>} A promise to the user
 */
module.exports.updateMap = (id, map) => {
  const keys = Object.keys(map);
  const cols = keys.map((e, i) => `${e} = $${i + 1}`);
  const queryString = `
  UPDATE maps
  SET ${cols.join(', ')}
  WHERE id = $${keys.length + 1}
  RETURNING *;`;
  const queryValues = keys.map((i) => map[i]);
  queryValues.push(id);
  console.log(queryString);
  return db
    .query(queryString, queryValues)
    .then((res) => res.rows)
    .catch((err) => console.error(err.stack));
};
