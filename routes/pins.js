const express = require("express");
const router = express.Router();
const pinsQueries = require("../db/helper/pin-queries");

//Browse /pins
router.get("/:mapid", (req, res) => {
  //need mapId //
  const mapId = req.params.mapid;
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
router.get("/:id", (req, res) => {
  const pinId = req.params.id;
  pinsQueries.getPinById(pinId).then((pin) => {
    res.json(pin);
  });
});

// Edit: /:id
router.post("/:id", (req, res) => {
  const pinId = req.params.id;
  pinsQueries
    .editPin(pinId, res.body)
    .then((response) => res.json(response))
    .catch((err) => console.error(err.stack));
});

// Delete: /:id/delete

router.get("/:id/delete", (req, res) => {
  const pinId = req.params.id;
  pinsQueries.deletePin(pinId).then((pin) => {
    res.json(pin);
  });
});

module.exports = router;
