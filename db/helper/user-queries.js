const db = require("../../lib/db");

module.exports.getUsers = () => {
  return db
    .query(`SELECT * FROM users;`)
    .then((res) => res.rows)
    .catch((err) => console.error(err.stack));
};

module.exports.getUserName = (id) => {
  const queryString = `
  SELECT name FROM users
  WHERE id = $1;`;
  const queryValues = [id];
  return db
    .query(queryString, queryValues)
    .then((res) => res.rows[0].name)
    .catch((err) => console.error(err.stack));
};
