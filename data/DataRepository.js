const db = require('./SQLConnection')
const req = require('./SQLRequest')
const product = require('../model/Product')
const Request = require('tedious').Request
const TYPES = require('tedious').TYPES;


function getProducts(page, rows){
  return new Promise((resolve, reject) => {
    products = []
    conn = db.DBConnection()
    conn.then(
      conn => {
        reqParams = [
          { Name: 'page', Type: TYPES.Int, Value: page },
          { Name: 'rows', Type: TYPES.Int, Value: rows }
        ]
        request = req.callStoredProcedure(conn, 'spGetProducts', reqParams)
        request.then(
          result => {
            products = SqlResultToProducts(result)
            const returnObj = {
                headers: Object.keys(products.products[0]),
                data: products.products,
                CurrentResultCount: products.products.length,
                CurrentPage: page,
                RowsPerPage: rows,
                TotalResultCount: products.TotalCount,
                TotalPages: Math.ceil(products.TotalCount / rows)
            }
            conn.close()
            resolve(returnObj)
          }
        )
      }
    )
  })
}

function SqlResultToProducts(sqlResults){
  let productResult = {}
  let products = []
  let totalProductCount = 0
  sqlResults.forEach(row => {
    let r = {}
    row.forEach( column => {
      r[column.metadata.colName] = column.value
    });
    const p = product.Product(
      r.ProductID, r.Name, r.StandardCost, r.ListPrice,
      r.Size, r.Weight, r.DaysToManufacture
    )
    products.push(p)
    totalProductCount = r.TotalCount
  });

  productResult.products = products
  productResult.TotalCount = totalProductCount
  return productResult
}

exports.products = getProducts
