var _product = {}

function Product(productId, name, StandardCost, ListPrice,size, weight, daysToManufacture){
  const p = Object.create(_product)
  
  p.ID = productId
  p.Name = name
  p.StandardCost = StandardCost
  p.ListPrice = ListPrice
  p.Size = size
  p.Weight = weight
  p.DaysToManufacture = daysToManufacture

  return p
}

exports.Product = Product
