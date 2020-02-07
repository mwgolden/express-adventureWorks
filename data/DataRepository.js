const db = require('./SQLConnection')
const product = require('../model/Product')
const Request = require('tedious').Request
const TYPES = require('tedious').TYPES;




function getProducts(page, rowsPerPage){
  return new Promise((resolve, reject) =>{
    conn = db.DBConnection()

    let data = []
    let totalProducts = 0
    let headers = []
    const request = new Request('spGetProducts', function(err, rowCount){
      if(err){
        console.log(err)
      }
    })
    request.addParameter('page', TYPES.Int, page)
    request.addParameter('rows', TYPES.Int, rowsPerPage)

    request.on('row', function(columns){
      let result = {}
      columns.map(column => {
        result[column.metadata.colName] = column.value
      })
      const p = product.Product(
        result.ProductID, result.Name, result.StandardCost, result.ListPrice,
        result.Size, result.Weight, result.DaysToManufacture
      )
      totalProducts = result.TotalCount
      data.push(p)
    })
    conn.then(
      conn => { conn.callProcedure(request) }
    )
    request.on('requestCompleted', function () {
      const returnObj = {
          headers: Object.keys(data[0]),
          data: data,
          CurrentResultCount: data.length,
          CurrentPage: page,
          RowsPerPage: rowsPerPage,
          TotalResultCount: totalProducts,
          TotalPages: Math.ceil(totalProducts / rowsPerPage)
      }
      resolve(returnObj)
    });
  })
}

exports.getProducts = getProducts
