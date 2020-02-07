const Connection = require('tedious').Connection
const config = require('./.sql-connection.json')

function DBConnection(){
  return new Promise( (resolve, reject) => {
    const conn = new Connection(config)
    conn.on('connect', function(err){
      if(err){
        reject(new Error(`${err}`))
      }
      resolve(conn)
    })
  })
}

exports.DBConnection = DBConnection
