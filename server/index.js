const app = require('express')();
const db = require('./db/index');
const passportSetup = require('./passport-setup.js');
const passport = require('passport');
const authRoutes = require('./authRoutes.js');

app.get('/api/hello', (req, res) => res.send('Hello'));

app.get('/api', (req, res) => res.send('Other route'));

app.use('/auth', authRoutes);

app.listen(process.env.PORT || 3001);
