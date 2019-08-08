const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const sql = require("msnodesqlv8");
const connectionString = "server=ser-sql2011;Database=NAV_MSI_PROD;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

app.use(cors())
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/of/:of([0-9]+)', async (req, res) => {
  console.log(req.method +" "+ req.url)
  const query = `select [Comp_ Serial No_], [Comp_ Item No_], [Comp_ Description], [Comp_ Lot No_], [Serial No_]
  from [PROD_MSI$Traçabilité OF]
  where [Prod_ Order No_] = 'OF${req.params.of}' 
  order by [Comp_ Serial No_] DESC`;
  sql.query(connectionString, query, (err, rows) => {
    if(err) {
      res.sendStatus(500)
      throw err
    }
    res.send(rows).status(200)
  });
})

app.get('/of/:of([0-9]+)/:sn([0-9]+)', async (req, res) => {
  console.log(req.method +" "+ req.url)
  const query = `select [Comp_ Serial No_], [Comp_ Item No_], [Comp_ Description], [Comp_ Lot No_], [Serial No_]
  from [PROD_MSI$Traçabilité OF]
  where [Serial No_] = 'OF${req.params.of + '-' + req.params.sn}'
  order by [Comp_ Serial No_] DESC`;
  sql.query(connectionString, query, (err, rows) => {
    if(err) {
      res.sendStatus(500)
      throw err
    }
    res.send(rows).status(200)
  });
})

app.get('/of/:of([0-9]+)/pv', async (req, res) => {
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

app.get('/of/:of([0-9]+)/procedes-speciaux', async (req, res) => {
  console.log(req.method +" "+ req.url)
  const inStatement = `(${procedesSpeciaux.map( x => `'${x}'` ).join()})`
  const query = `SELECT Description as description
  FROM [NAV_MSI_PROD].[dbo].[PROD_MSI$Prod_ Order Routing Line]
  WHERE [Prod_ Order No_] = 'OF${req.params.of}' AND No_ IN ${inStatement}`;
  sql.query(connectionString, query, (err, rows) => {
    if(err) {
      res.sendStatus(500)
      throw err
    }
    res.send(rows).status(200)
  });
})

app.get('/of/:of([0-9]+)/description', async (req, res) => {
  console.log(req.method +" "+ req.url)
  const query = `SELECT DISTINCT Description as description
  FROM [NAV_MSI_PROD].[dbo].[PROD_MSI$Traçabilité OF]
  where [Prod_ Order No_] = 'OF${req.params.of}'`;
  sql.query(connectionString, query, (err, rows) => {
    if(err) {
      res.sendStatus(500)
      throw err
    }
    res.send(rows).status(200)
  });
})

const procedesSpeciaux = [
  'CND2',
  'CND1',
  'CND3',
  'HVOF1',
  'LASER1',
  'MONT2',
  'MONT5',
  'PTA1',
  'QPQ1',
  'QPQ2',
  'ST-112',
  'ST-126',
  'ST-135',
  'ST-105',
  'ST-110',
  'ST-115',
  'ST-116',
  'ST-120',
  'ST-122',
  'ST-124',
  'ST-125',
  'ST-128',
  'ST-130',
  'ST-131',
  'ST-132',
  'ST-135',
  'ST-105',
  'ST-110',
  'ST-115',
  'ST-116',
  'ST-120',
  'ST-122',
  'ST-124',
  'ST-125',
  'ST-128',
  'ST-130',
  'ST-131',
  'ST-132',
  'ST-15',
  'ST-17',
  'ST-18',
  'ST-19',
  'ST-19',
  'ST-20',
  'ST-20',
  'ST-20',
  'ST-21',
  'ST-22',
  'ST-22',
  'ST-22',
  'ST-41',
  'ST-39',
  'ST-44',
  'ST-47',
  'ST-48',
  'ST-49',
  'ST-52',
  'ST-57',
  'ST-57',
  'ST-58',
  'ST-70'
]
// const procedesSpeciaux = {
//   MAGNETOSCOPIE : 'CND2',
//   RESSUAGE : 'CND1',
//   ULTRASONS : 'CND3', 
//   HVOF : 'HVOF1',
//   LASER : 'LASER1',
//   TEST_MSI : 'MONT2',
//   TEST_FLUSHING : 'MONT5',
//   PTA : 'PTA1',
//   QPQ : 'QPQ%',
//   ST : 'ST%'
// }