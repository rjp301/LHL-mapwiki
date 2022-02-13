const express = require('express');
const router  = express.Router();
const mapsQueries = require("../db/helper/map-queries");


router.get("/:id", (req, res) => {
  // res.send(`Hello this is maps number ${req.params.id}`);
  res.render("map-page");

  //// IMPLEMENT DATABASE LATER ////
  // db.query(`SELECT * FROM maps WHERE id = $1;`, [req.params.id])
  //   .then(data => {
  //     const users = data.rows;
  //     res.json({ users });
  //   })
  //   .catch(err => {
  //     res
  //       .status(500)
  //       .json({ error: err.message });
  //   });
});

module.exports = router;
