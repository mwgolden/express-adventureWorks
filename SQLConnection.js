const Connection = require('tedious').Connection
const Request = require('tedious').Request
const config = require('./.sql-connection.json')


function getProducts(res) {
  var connection = new Connection(config)

  connection.on('connect', function(err){
    if(err){
      console.log(`There was an issue: ${err}`)
    }else{
      console.log('Connected to database')
      const sql = 'SELECT ProductID, Name, Color, StandardCost,ListPrice,Size,Weight,DaysToManufacture  FROM Production.Product'
      var request = new Request(sql, function(err, rowCount, rows){
        let resultSet = []
        let columnHeaders = []
        rows.forEach( row  => {
          let product = {}
          row.forEach(column => {
            if(!columnHeaders.includes(column.metadata.colName)){
                columnHeaders.push(column.metadata.colName)
            }
            product[column.metadata.colName] = column.value
          })
          resultSet.push(product)
        })
        //console.log(resultSet)
        res.render('products',{products: {headers: columnHeaders, data: resultSet}})
      })
      request.on('requestCompleted', function(){
        connection.close()
      })
      connection.execSql(request)
    }
  })
}

exports.getProducts = getProducts
