module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host : '127.0.0.1',
      port: 15432,
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
      host : '127.0.0.1',
      port: 5432,
      user : 'geodevdb',
      password : 'Gmcb1p4y_',
      database : 'geodevdb'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
