const app = require('express')();
const db = require('./db/index');

app.get('/api/hello', (req, res) => res.send('Hello'));

app.listen(process.env.PORT || 3001);