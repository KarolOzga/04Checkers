const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));

// app.use(express.static(path.join(__dirname, '/src/modules')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

let activeUsers = [];

app.post('/addUser', (req, res) => {
    setTimeout(() => {
        if (activeUsers.length < 2) {
            if (activeUsers.length === 1 && activeUsers[0].userName === req.body.userName) {
                res.status(409).json({ error: 'Nie możesz grać sam ze sobą' });
                return;
            }
            activeUsers.push(req.body);
            res.json({ user: activeUsers.length, userName: req.body.userName });
        } else if (activeUsers.length === 2) {
            res.status(403).json({ error: 'Oba miejsca zajęte, zresetuj grę by zwolnić miejsca' });
        }
    }, 100);
});
app.post('/resetUsers', (req, res) => {
    activeUsers = [];
    res.json({ message: 'Zresetowano graczy' });
});

app.post('/whichPlayer', (req, res) => {
    res.json({ player: activeUsers.length });
});

app.listen(PORT, '0.0.0.0', function () {
    console.log('start serwera na porcie ' + PORT);
});
