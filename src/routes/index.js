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
  const query = {
    text: "WITH get_importid AS (INSERT INTO imports (importname) VALUES ($1) returning importid) INSERT INTO imported_data (\"importid\", \"Name\", \"Address\", \"Address 2\", \"City\", \"State\", \"Zip\", \"Purpose\", \"Property Owner\", \"Creation Date\", \"Lat\", \"Long\") VALUES ( (SELECT importid FROM get_importid), '3Com Corp', '350 Campus Dr', '', 'Marlborough', 'MA', '01752', 'Technology', '3Com Corp', '2017-05-04', '42.3256103', '-71.58414069999998' )",
    values: ['test']
  }
  db.query(query, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res.rows[0]);
    }
  });
});

module.exports = router;