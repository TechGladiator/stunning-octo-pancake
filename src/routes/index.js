// src/routes/index.js
const router = require('express').Router();
const db = require('../sql');

router.get('/search/:id', (req, res, next) => {
  const id = req.params.id;
  db.query('SELECT name, address, address2, city, statecode, zip, purpose, "propertyOwner", "creationDate", lat, long FROM imports JOIN imported_data ON imports.importid=imported_data.importid WHERE importname = $1', [id], (err, res) => {
    if (err) {
      return next(err);
    }
    res.send(res.rows[0]);
  });
});

module.exports = router;