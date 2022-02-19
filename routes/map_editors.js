const router = require('express').Router();
const editorQueries = require('./../db/helper/map_editor-queries');

router.post('/', (req, res) => {
  // add editor
  editorQueries
    .addMapEditor(req.body.userId, req.body.mapId)
    .then(response => res.json(response))
    .catch(err => console.error(err.stack));
});

router.post('/:id/delete', (req, res) => {
  // remove editor
  editorQueries
    .removeMapEditor(req.body.userId, req.body.mapId)
    .then(response => res.json(response))
    .catch(err => console.error(err.stack));
});

module.exports = router;
