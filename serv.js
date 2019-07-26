const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/file/:filename', (req, res) => {
  const fileName = req.params.filename
  res.send(fileName)
})