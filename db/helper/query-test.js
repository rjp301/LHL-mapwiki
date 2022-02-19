require("dotenv").config();
const mapQueries = require('./map-queries');

mapQueries
  .getEditMapsByUserId(4)
  .then(res => console.log(res));

