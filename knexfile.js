var os = require('os');

var hostname = os.hostname();
var type = os.type();

//display the host computer name
console.log('os.hostname(): ' + os.hostname());
//display the os type (Linux, Windows, etc.)
console.log('os.type(): ' + os.type());
console.log();

//node is not being run locally.
//port 15432 on the host is forwarded to 5432 on the vm
var port = 5432;
if (hostname !== "geodev") { port = 15432; }

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host : '127.0.0.1',
      port: port,
      user : 'geodevdb',
      password : 'admin123',
      database : 'geodevdb'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      database: 'example'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
