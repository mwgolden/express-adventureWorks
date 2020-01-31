const express = require('express')
const sqlConnection = require('./SQLConnection')
const handlebars  = require('express-handlebars');
const app = express()
const port = 3000


const exphbs = handlebars.create({
  helpers:{
    dataCount: function(data){return data.length},
    return10: function(data){return data.slice(0, 9)}
  }
})
app.engine('handlebars', exphbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.get('/Catalog', (req, res) => {
  let page = req.query.page
  let rows = req.query.rows
  console.log(`page: ${page}`)
  console.log(`rows: ${rows}`)
  if(page === undefined){
    page = 1
  }
  if(rows === undefined){
    rows = 10
  }
  sqlConnection.getProducts(res, page, rows)
})

app.listen(port, () => console.log(`App listening on port ${port}`))
