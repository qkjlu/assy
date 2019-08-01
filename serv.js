const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const sql = require("msnodesqlv8");
const connectionString = "server=ser-sql2011;Database=NAV_MSI_PROD;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

app.use(cors())

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/of/:of', async (req, res) => {
  console.log(req.method +" "+ req.url)
  const query = `select [Comp_ Serial No_], [Comp_ Item No_], [Comp_ Description], [Comp_ Lot No_], [Serial No_]
  from [PROD_MSI$Traçabilité OF]
  where [Prod_ Order No_] = 'OF${req.params.of}' and [Comp_ Item No_] NOT LIKE 'FOURN%'
  order by [Comp_ Serial No_]`;

  sql.query(connectionString, query, (err, rows) => {
    if(err) {
      res.sendStatus(500)
      throw err
    }
    res.send(rows).status(200)
  });
})

app.get('/of/:of/pv', async (req, res) => {
  console.log(req.method +" "+ req.url)
  const query = `select Num, IdUser
  from  [CP_PV_BASE]
  where NumOf = '${req.params.of}'`;

  sql.query(connectionString, query, (err, rows) => {
    if(err) {
      res.sendStatus(500)
      throw err
    }
    res.send(rows).status(200)
  });
})