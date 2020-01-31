const Connection = require('tedious').Connection
const Request = require('tedious').Request
const TYPES = require('tedious').TYPES;
const config = require('./.sql-connection.json')


function getProducts(res, page, rows) {
  var connection = new Connection(config)

  connection.on('connect', function(err){
    const request = new Request('spGetProducts', function(err, rowCount, rows){
      if(err){
        console.log(err)
      }
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
      connection.close()
    })
    request.addParameter('page', TYPES.Int, page)
    request.addParameter('rows', TYPES.Int, rows)
    connection.callProcedure(request)
  })
}

exports.getProducts = getProducts
