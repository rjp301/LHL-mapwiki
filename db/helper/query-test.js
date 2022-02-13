const { getMaps,
  getMapById,
  getFavMapsByUserId,
  getEditMapsByUserId,
  addMap,
  deleteMap,
  updateMap } = require('./map-queries');

const { getUsers } = require('./user-queries');
const db = require('./../../lib/db');
db.query(`SELECT * FROM maps`)
  .then(res => console.log(res.rows))
  .catch(err => console.error(err.stack));
