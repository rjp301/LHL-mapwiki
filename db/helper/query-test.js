require("dotenv").config();
const pinQueries = require('./pin-queries');

pinQueries
  .deletePin(5)
  .then(res => console.log(res));

