const express = require('express')
const sqlConnection = require('./SQLConnection')
const handlebars  = require('express-handlebars');
const app = express()
const port = 3000


const exphbs = handlebars.create()
app.engine('handlebars', exphbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.get('/Catalog', (req, res) => {
  let page = req.query.page
  let rows = req.query.rows
  if(page === undefined){
    page = 1
  }
  if(rows === undefined){
    rows = 10
  }
  sqlConnection.getProducts(res, page, rows)
})

app.listen(port, () => console.log(`App listening on port ${port}`))
