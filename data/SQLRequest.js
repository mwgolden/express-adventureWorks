const Request = require('tedious').Request
const TYPES = require('tedious').TYPES;

function sp(db, spCall, params){
  return new Promise((resolve, reject) =>{
    let resultSet = []
    const request = new Request(spCall, (error, rowCount) => {
      if(error){
        console.log(error)
      }
      console.log(rowCount)
    })
    params.forEach(param => {
      request.addParameter(param.Name, param.Type, param.Value)
    });
    request.on('row', (columns) => {
      resultSet.push(columns)
    })
    request.on('requestCompleted', () => {
      resolve(resultSet)
      db.close()
    })
    db.callProcedure(request)
  })
}

exports.callStoredProcedure = sp
