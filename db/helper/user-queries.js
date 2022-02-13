const db = require("../../lib/db");

//get users//
const getUsers = () => {
  return db.query(`SELECT * FROM users;`).then((response) => {
    return response.rows;
  });
};

module.exports = {
  getUsers,
};
