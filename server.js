const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));

app.use(express.static(path.join(__dirname, '/src/modules')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/addUser', (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.listen(PORT, function () {
    console.log('start serwera na porcie ' + PORT);
});
