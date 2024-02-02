const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const http = require('http');
const server = http.createServer(app); // tu zmiana
const { Server } = require('socket.io');
const socketio = new Server(server, {
    cors: {
        origin: 'http://192.168.0.171:3000',
        methods: ['GET', 'POST'],
    },
});
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));
app.use(express.json());

let setPlayerMove = 'pink';

// app.use(express.static(path.join(__dirname, '/src/modules')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

socketio.on('connection', (client) => {
    console.log('klient się podłączył z id = ', client.id);
    client.emit('onconnect', {
        clientId: client.id,
    });
    client.on('disconnect', (reason) => {
        console.log('klient się rozłącza', reason);
    });

    client.on('pawnMoved', (data) => {
        client.broadcast.emit('pawnMoved', data);
    });
    client.emit('pawnMoved', { clientId: client.id });
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
    res.json({ player: activeUsers.length, userName: req.body.userName, users: activeUsers });
});

app.post('/setPlayerMove', (req, res) => {
    console.log(req.body);
    if (req.body.setPlayerMove <= 8) {
        setPlayerMove = 'gray';
    } else if (req.body.setPlayerMove > 8) {
        setPlayerMove = 'pink';
    }
    res.json({ player: setPlayerMove });
});

app.get('/whichUserTurn', (req, res) => {
    res.json({ player: setPlayerMove });
});

server.listen(PORT, '0.0.0.0', function () {
    console.log('start serwera na porcie ' + PORT);
});
