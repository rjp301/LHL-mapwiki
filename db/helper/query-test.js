const { getMaps,
  getMapById,
  getFavMapsByUserId,
  getEditMapsByUserId,
  addMap,
  deleteMap,
  updateMap } = require('./map-queries');

const { getUsers } = require('./user-queries');

console.log(getUsers());
