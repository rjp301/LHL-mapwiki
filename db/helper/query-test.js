const mapsQueries = require('./map-queries');
const usersQueries = require('./user-queries');
const db = require('./../../lib/db');

// db.query('SELECT * FROM pg_catalog.pg_tables', function(err, result) {
//   console.log(result);
// });

db.query(`SHOW *;`)
  .then(res => console.log(res.rows))
  .catch(err => console.error(err.stack));
