const Connection = require('tedious').Connection
const Request = require('tedious').Request
const TYPES = require('tedious').TYPES;
const config = require('./.sql-connection.json')


function getProducts(res, page, rowsPerPage) {
  var connection = new Connection(config)
  connection.on('connect', function(err){
    const request = new Request('spGetProducts', function(err, rowCount, rows){
      if(err){
        console.log(err)
      }
      let columnHeaders = rows[0].map((column) => {
        return column.metadata.colName
      })
      columnHeaders.pop() //removing totalcount from row headers

      let totalResults = rows[0].filter((column) =>{
        if(column.metadata.colName === 'TotalCount'){
          return column
        }
      })[0]

      let resultSet = []
      rows.forEach( row  => {
        let product = {}
        row.forEach(column => {
          if(columnHeaders.includes(column.metadata.colName)){
            product[column.metadata.colName] = column.value
          }
        })
        resultSet.push(product)
      })
      res.render('products',
            {
                products:
                  { headers: columnHeaders,
                    data: resultSet,
                    CurrentResultCount: resultSet.length,
                    CurrentPage: page,
                    RowsPerPage: rowsPerPage,
                    TotalResultCount: totalResults.value,
                    TotalPages: Math.ceil(totalResults.value / rowsPerPage)
                  },
                helpers: {
                  previousPage: function(CurrentPage){return page - 1},
                  nextPage: function(CurrentPage){return parseInt(page) + 1},
                  outputRange: function(CurrentPage, RowsPerPage) {
                      return `Results ${1 + (page - 1) * rowsPerPage} - ${(page - 1) * rowsPerPage + parseInt(rowsPerPage)}`
                  }
                }
              })
      connection.close()
    })
    request.addParameter('page', TYPES.Int, page)
    request.addParameter('rows', TYPES.Int, rowsPerPage)
    connection.callProcedure(request)
  })
}

exports.getProducts = getProducts
