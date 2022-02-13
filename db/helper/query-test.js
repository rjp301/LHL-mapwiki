const mapsQueries = require('./map-queries');
const usersQueries = require('./user-queries');
const db = require('./../../lib/db');

const { getUsers } = require('./user-queries');
const db = require('./../../lib/db');
db.query(`SELECT * FROM maps`)
  .then(res => console.log(res.rows))
  .catch(err => console.error(err.stack));
