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

module.exports.findGoogleUser = async (googleId) => {
  client.query(`SELECT * FROM users WHERE google_id = '${googleId}';`);
};

module.exports.addGoogleUser = (googleId, displayName, firstName) => {
  client.query(`INSERT INTO users (google_id, display_name, first_name) VALUES ('${googleId}', '${displayName}', '${firstName}') RETURNING google_id;`);
};

module.exports.client = client;
