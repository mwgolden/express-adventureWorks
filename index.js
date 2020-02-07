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
  res.send('Hello World')
})

app.get('/Catalog', (req, res) => {
  let page = req.query.page === undefined ? 1 : req.query.page
  let rows = req.query.rows === undefined ? 10 : req.query.rows

  const productResult = repo.getProducts(page, rows)
  productResult.then(
    catalog => { res.render('products', {
      products: catalog,
      helpers: {
        previousPage: function(CurrentPage){return page - 1},
        nextPage: function(CurrentPage){return parseInt(page) + 1},
        outputRange: function(CurrentPage, RowsPerPage) {
            return `Results ${1 + (page - 1) * RowsPerPage} - ${(page - 1) * RowsPerPage + parseInt(RowsPerPage)}`
        }
      }
    })
  })
})

app.listen(port, () => console.log(`App listening on port ${port}`))
