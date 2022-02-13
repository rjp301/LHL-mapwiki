const db = require("../../lib/db");

module.exports.getUsers = () => {
  return db
    .query(`SELECT * FROM users;`)
    .then((res) => res.rows)
    .catch((err) => console.error(err.stack));
};
