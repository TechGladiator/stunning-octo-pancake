// src/routes/index.js
const router = require('express').Router();
const db = require('../sql');

router.get('/search/:id', (req, res, next) => {
  const id = req.params.id;
  db.query('SELECT "Name", "Address", "Address 2", "City", "State", "Zip", "Purpose", "Property Owner", "Creation Date", "Lat", "Long" FROM imports JOIN imported_data ON imports.importid=imported_data.importid WHERE importname = $1', [id], (err, results) => {
    if (err) {
      return next(err);
    }
    res.send(results.rows);
  });
});

router.post('/import/', (req, res, next) => {
  res.send('Test response');
  console.log('req = ', res);
  const importname = req.importName;
  const fieldData = req.fieldData;
  // db.query();
  console.log('importname = ', importname);
  console.log('fieldData = ', fieldData);
});

module.exports = router;