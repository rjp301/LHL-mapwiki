const db = require("../../lib/db");

//get widgets//
const getWidgets = () => {
  return db.query(`SELECT * FROM users;`).then((respnose) => {
    return respnose.rows;
  });
};

module.exports = {
  getWidgets,
};
