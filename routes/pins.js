const express = require("express");
const router = express.Router();
const pinsQueries = require("../db/helper/pin-queries");

// Browse:
//   - Fullscreen map page
//   - All pins which match with the selected map
//GET /pins
router.get("/bymap/:mapid", (req, res) => {
  //need mapId //
  const mapId = req.params.mapid
  pinsQueries
    .getPinsByMap(mapId)
    .then((pins) => {
      res.json(pins);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Read: /:id
//   - Fullscreen map page
//   - click the pin and show the details of pin info
router.get("/:id", (req, res) => {
  const pinId = req.params.id;
  pinsQueries.getPinById(pinId).then((pin) => {
    res.json(pin);
  });
});

// Add: /new
//   - Full screen map page
//   - click the a point of the map and add new pin
//   - Calls pinQueries.addPin
router.post("/new", (req, res) => {
  console.log(req.body);
  const pinData = req.body;

  pinsQueries.addPinToMap(pinData)
    .then((pins) => {
      res.json(pins);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    })
});

// Delete: /:id/delete
//   - Button on thumbnail in index page
//   - calls pinQueries.deletePin
// */
router.get("/:id/delete", (req, res) => {
  const pinId = req.params.id;
  pinsQueries.deletePin(pinId).then((pin) => {
    res.json(pin);
  });
});

module.exports = router;
