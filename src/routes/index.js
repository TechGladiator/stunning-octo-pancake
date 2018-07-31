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
  const importData = {
    importName: req.body.importName,
    fieldData: req.body.fieldData
  }

  let insertValues = '';
  let i = 0;
  
  importData.fieldData.forEach(e => {
    insertValues += '((SELECT importid FROM get_importid)';
    for (const k in e) {
      if (e.hasOwnProperty(k)) {
        const f = e[k];
        insertValues += `, '${f}'`;
      }
    }
    insertValues += ')';
    if (i != importData.fieldData.length - 1) {
      insertValues += ',';
    } else {
      insertValues += ';';
    }
    i++;
  });

  const insertRecordText = `WITH get_importid AS (INSERT INTO imports (importname) VALUES ($1) returning importid) INSERT INTO imported_data ("importid", "Name", "Address", "Address 2", "City", "State", "Zip", "Purpose", "Property Owner", "Creation Date", "Lat", "Long") VALUES ${insertValues}`;

  db.query(insertRecordText, [importData.importName], (err, res) => {
    if (err) {
      return next(err);
    }
  });

  res.send(req.params);

});

module.exports = router;