const router  = require('express').Router();
const mapsQueries = require("../db/helper/map-queries");


/*
Browse: /
  - Main index page
  - All maps as small thumnbnails in grid
  - Calls mapQueries.getMaps
  - returns array of map objects

Browse: /favourites
  - Main index page
  - Maps filtered by user favourites
  - Calls mapQueries.getFavMapsByUserId
  - returns array of map objects

Browse: /editable
  - Main index page
  - Maps filtered by user editable
  - Calls mapQueries.getEditMapsByUserId
  - returns array of map objects

Read: /:id
  - Redirects to fullscreen map page
  - Buttons for adding, deleting or moving pins are hidden
  - Calls mapQueries.getMapById

Edit: /:id/edit
  - Redirects to fullscreen map page
  - Buttons for adding, deleting or moving pins

Add: /new
  - Button in nav bar of index
  - Redirects to /:id/edit with new ID
  - Calls mapQueries.addMap

Delete: /:id/delete
  - Button on thumbnail in index page
  - calls mapQueries.deleteMap
*/


router.get('/', (req, res) => {
  mapsQueries
    .getMaps()
    .then(response => res.json(response))
    .catch(err => console.error(err.stack));
});

router.get('/favourites', (req, res) => {
  const userId = req.cookies.userId;
  mapsQueries
    .getFavMapsByUserId(userId)
    .then(response => res.json(response))
    .catch(err => console.error(err.stack));
});

router.get('/editable', (req, res) => {
  const userId = req.cookies.userId;
  mapsQueries
    .getEditMapsByUserId(userId)
    .then(response => res.json(response))
    .catch(err => console.error(err.stack));
});

router.get('/:id', (req, res) => {

});

router.get('/:id/edit', (req, res) => {

});

router.get('/:id/delete', (req, res) => {
  mapsQueries
    .deleteMap(req.params.id)
    .then(response => res.json(response))
    .catch(err => console.error(err.stack));
});

router.get('/new', (req, res) => {

});



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

module.exports = router;
