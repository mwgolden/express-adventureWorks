const express = require('express')
const sqlConnection = require('./data/SQLConnection')
const repo = require('./data/DataRepository')
const handlebars  = require('express-handlebars');
const app = express()
const port = 3000


const exphbs = handlebars.create()
app.engine('handlebars', exphbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.send('Hello Adventureworks')
})

app.get('/Catalog', (req, res) => {
  let page = req.query.page === undefined ? 1 : req.query.page
  let rows = req.query.rows === undefined ? 10 : req.query.rows

  getCatalogPage = repo.products(page, rows)
  getCatalogPage.then(
    page => {
      res.render('products', {
        products: page,
        helpers: {
        previousPage: function(CurrentPage){return parseInt(CurrentPage) - 1},
        nextPage: function(CurrentPage){return parseInt(CurrentPage) + 1},
        outputRange: function(CurrentPage, RowsPerPage) {
            return `Results ${1 + (CurrentPage - 1) * RowsPerPage} - ${(CurrentPage - 1) * RowsPerPage + parseInt(RowsPerPage)}`
        }
      }
    })
  })
})

app.listen(port, () => console.log(`App listening on port ${port}`))
