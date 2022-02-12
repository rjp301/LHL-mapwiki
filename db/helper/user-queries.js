const db = require("../../lib/db");

//get users//
const getUsers = () => {
  return db.query(`SELECT * FROM users;`).then((respnose) => {
    return respnose.rows;
  });
};

module.exports = {
  getUsers,
};
