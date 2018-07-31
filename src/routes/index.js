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
  // res.json(importData);

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
  
  res.send(insertValues);
  
  db.connect((err, client, done) => {
    
    const shouldAbort = (err) => {
      if (err) {
        console.error('Error in transaction', err.stack)
        client.query('ROLLBACK', (err) => {
          if (err) {
            console.error('Error rolling back client', err.stack);
          }
          // release the client back to the pool
          done();
        })
      }
      return !!err;
    }
    
    client.query('BEGIN', (err) => {
      if (shouldAbort(err)) return;
      client.query('WITH get_importid AS (INSERT INTO imports (importname) VALUES ($1) returning importid)', [importData.importName], (err, res) => {
        if (shouldAbort(err)) return;
        const insertRecordText = 'INSERT INTO imported_data ("importid", "Name", "Address", "Address 2", "City", "State", "Zip", "Purpose", "Property Owner", "Creation Date", "Lat", "Long") VALUES ($1)';
        client.query(insertRecordText, insertValues, (err, res) => {
          if (shouldAbort(err)) return;
          client.query('COMMIT', (err) => {
            if (err) {
              console.error('Error committing transaction', err.stack);
            }
            done();
          });
        });
      });
    });
  });
});

module.exports = router;