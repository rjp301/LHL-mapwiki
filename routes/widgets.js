/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const widgetsQueries = require("../db/helper/widgets-queries");

//GET /widgets
router.get("/", (req, res) => {
  widgetsQueries
    .getWidgets()
    .then((widgets) => {
      res.json(widgets);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
