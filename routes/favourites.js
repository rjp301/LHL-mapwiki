const router = require('express').Router();
const favouritesQueries = require('./../db/helper/favourite-queries');

router.post('/', (req, res) => {
  // add editor
  favouritesQueries
    .addMapToFavourites(req.body.userId, req.body.mapId)
    .then(response => res.json(response))
    .catch(err => console.error(err.stack));
});

router.post('/delete', (req, res) => {
  // remove editor
  favouritesQueries
    .removeMapFromFavourites(req.body.userId, req.body.mapId)
    .then(response => res.json(response))
    .catch(err => console.error(err.stack));
});

module.exports = router;
