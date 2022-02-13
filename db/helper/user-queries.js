const db = require("../../lib/db");

const getUsers = () => {
  return db
    .query(`SELECT * FROM users;`)
    .then((res) => res.rows)
    .catch((err) => console.error(err.stack));
};

module.exports = {
  getUsers,
};
