const pg = require('pg');

const client = new pg.Client();
(async () => {
  try {
    await client.connect();
    console.log(`Connected To ${client.database} at ${client.host}:${client.port}`);
  } catch (err) {
    console.log('Could not connect to the database!', err);
  }
})();

module.exports = client;
