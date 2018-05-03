const app = require('express')();
const db = require('./db/index');

app.get('/api/hello', (req, res) => res.send('Hello'));

app.get('/api', (req, res) => res.send('Other route'));

app.listen(process.env.PORT || 3001);