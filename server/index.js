const app = require('express')();

app.get('/api', (req, res) => res.send('Hello'));

app.listen(process.env.PORT || 3001);