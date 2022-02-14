const router = require("express").Router();
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

router.get("/", (req, res) => {
  // Get all maps
  mapsQueries
    .getMaps()
    .then((response) => res.json(response))
    .catch((err) => console.error(err.stack));
});

router.post("/", (req, res) => {
  // Create a new map
  mapsQueries
    .addMap(req.body)
    .then((response) => res.json(response))
    .catch((err) => console.error(err.stack));
});

router.get("/favourites", (req, res) => {
  // Get maps that have been favourited
  const userId = req.cookies.userId;
  mapsQueries
    .getFavMapsByUserId(userId)
    .then((response) => res.json(response))
    .catch((err) => console.error(err.stack));
});

router.get("/editable", (req, res) => {
  // Get maps that are editable
  const userId = req.cookies.userId;
  mapsQueries
    .getEditMapsByUserId(userId)
    .then((response) => res.json(response))
    .catch((err) => console.error(err.stack));
});

router.get("/:id", (req, res) => {
  // Get info of single map by id
  mapsQueries
    .getMapById(req.params.id)
    .then((response) => res.json(response))
    .catch((err) => console.error(err.stack));
});

router.post("/:id", (req, res) => {
  // Update map info
  mapsQueries
    .updateMap(req.params.id, req.body)
    .then((response) => res.json(response))
    .catch((err) => console.error(err.stack));
});

router.get("/:id/delete", (req, res) => {
  // Delete map from database
  mapsQueries
    .deleteMap(req.params.id)
    .then((response) => res.json(response))
    .catch((err) => console.error(err.stack));
});


module.exports = router;
