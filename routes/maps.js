const express = require("express");
const router = express.Router();
const mapsQueries = require("../db/helper/map-queries");

/*
Browse: /
  - Main index page
  - All maps as small thumnbnails in grid
  - Calls mapQueries.getMaps

Browse: /favourites
  - Main index page
  - Maps filtered by user favourites
  - Calls mapQueries.getFavMapsByUserId

Browse: /editable
  - Main index page
  - Maps filtered by user editable
  - Calls mapQueries.getEditMapsByUserId

Read: /:id
  - Fullscreen map page
  - Buttons for adding, deleting or moving pins are hidden
  - Calls mapQueries.getMapById

Edit: /:id/edit
  - Fullscreen map page
  - Buttons for adding, deleting or moving pins

Add: /new
  - Button in nav bar of index
  - Redirects to /:id/edit with new ID
  - Calls mapQueries.addMap

Delete: /:id/delete
  - Button on thumbnail in index page
  - calls mapQueries.deleteMap
*/

router.get("/:id", (req, res) => {
  // res.send(`Hello this is maps number ${req.params.id}`);
  const apiKey = process.env.API_KEY;
  const templateVars = { apiKey };
  res.render("map-page", templateVars);

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

//GET /maps

router.get("/", (req, res) => {
  mapsQueries
    .getMaps()
    .then((maps) => {
      res.json(maps);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
