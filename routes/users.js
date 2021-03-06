/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const userQueries = require("../db/helper/user-queries");

//GET /users
router.get("/", (req, res) => {
  userQueries
    .getUsers()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/:id', (req, res) => {
  userQueries
    .getUserName(req.params.id)
    .then(name => res.json(name))
    .catch((err) => console.error(err.stack));
});

module.exports = router;
