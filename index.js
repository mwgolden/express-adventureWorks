const express = require('express')
const sqlConnection = require('./SQLConnection')
const exphbs  = require('express-handlebars');
const app = express()
const port = 3000

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
  sqlConnection.getProducts(res)
})

app.listen(port, () => console.log(`App listening on port ${port}`))
