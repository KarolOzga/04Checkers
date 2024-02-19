import { GameObject } from './Main.js';
import { camera } from './Main.js';
import { GeneratePawns } from './Main.js';
import { allEvents } from './UI.js';
import { setCorrectUserPawnColor } from './Main.js';

import { client } from './Main.js';
import { scene } from './Main.js';
import { pionki } from './Main.js';

const allNetFunctions = {
    isUserOneLogged: false,
    isUserTwoLogged: false,
    loginData: null,
    fields: [],
    fields2D: [],

    loginUser(userName) {
        let userNameAsParametr = userName;
        fetch('http://192.168.0.171:3000/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName: userName }),
        })
            .then((response) => {
                if (response.status === 403) {
                    allEvents.reject();
                    throw new Error('Oba miejsca zajęte, zresetuj grę by zwolnić miejsca.');
                } else if (response.status === 409) {
                    allEvents.sameUser();
                    throw new Error('Nie możesz grać sam ze sobą');
                } else if (response.ok) {
                    allEvents.closeDialog();
                }
                return response.json();
            })
            .then((data) => {
                this.loginData = data;
                this.whichPlayer(userNameAsParametr);
                GameObject.setPlayer(data);
                if (data.user === 1) {
                    allNetFunctions.isUserOneLogged = true;
                    setCorrectUserPawnColor();
                    allEvents.hello();
                    GeneratePawns('pink');
                    allEvents.loading();
                    camera.setCameraPosition(-5, 5, 3);
                    camera.setLookAt(4, 0, 3);
                } else if (data.user === 2) {
                    allNetFunctions.isUserTwoLogged = true;
                    setCorrectUserPawnColor();
                    GeneratePawns('gray');
                    allEvents.loading();
                    allEvents.cancelLoading();
                    allEvents.hello();
                    camera.setCameraPosition(12, 5, 3);
                    camera.setLookAt(4, 0, 3);
                }
            })
            .catch((error) => console.log(error));
    },

    whichPlayer(userName) {
        let interval = setInterval(() => {
            fetch('http://192.168.0.171:3000/whichPlayer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName: userName }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.player === 1) {
                        this.isUserOneLogged = true;
                        this.isUserTwoLogged = false;

                        // GeneratePawns('pink');
                    } else if (data.player === 2) {
                        allEvents.loading();
                        allEvents.cancelLoading();
                        // Display the opponent's username
                        allEvents.helloSecondUser(data.users.find((user) => user.userName !== userName).userName);
                        this.isUserOneLogged = true;
                        this.isUserTwoLogged = true;

                        // GeneratePawns('pink');
                        clearInterval(interval);
                    }

                    if (this.loginData.user === 1) {
                        GeneratePawns('gray');
                    } else {
                        GeneratePawns('pink');
                    }

                    if (this.isUserOneLogged && this.isUserTwoLogged) {
                        client.emit('secondUserConnected');

                        client.on('secondUserConnected', (data) => {
                            allEvents.waitForSecondPlayerMove('pink');
                        });
                        allEvents.cancelLoading();

                        // console.log(scene.children, 'scene.children');

                        for (let i = 0; i < scene.children.length; i++) {
                            if (scene.children[i].isField) {
                                this.fields.push(scene.children[i]);
                            }
                        }

                        for (let i = 0; i < 8; i++) {
                            this.fields2D[i] = [];
                            for (let j = 0; j < 8; j++) {
                                this.fields2D[i][j] = this.fields[i * 8 + j];
                            }
                        }

                        for (let i = 0; i < pionki.length; i++) {
                            for (let j = 0; j < pionki[i].length; j++) {
                                if (pionki[i][j] === 1 || pionki[i][j] === 2) {
                                    this.fields2D[i][j].isFree = false;
                                }
                            }
                        }
                        // client.emit('timeUp');
                        // allEvents.waitForSecondPlayerMove('pink');
                    }
                });
        }, 1000);
    },

    resetUsers() {
        fetch('http://192.168.0.171:3000/resetUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName: null }),
        })
            .then((response) => response.json())
            .then((data) => {
                let resetBt = document.getElementById('resetBt');
                resetBt.classList.remove('pulse-button');
                let userInfo = document.getElementById('hello');
                userInfo.innerHTML = 'Pomyślnie zresetowano graczy !!!';
                setTimeout(() => {
                    userInfo.innerHTML = '';
                }, 1000);

                allEvents.isUserLogged = false;
                camera.setCameraPosition(3.65, 5, 12);
            })
            .catch((error) => console.log(error));
    },
    setPlayerMove(player) {
        fetch('http://192.168.0.171:3000/setPlayerMove', {
            // replace with your server endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ setPlayerMove: player }),
        })
            .then((response) => response.json())
            .then((data) => {})
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    getPlayerMove() {
        fetch('http://192.168.0.171:3000/whichUserTurn', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                let whoseMove = data.player;
                allEvents.waitForSecondPlayerMove(whoseMove);
            });
    },
};

export { allNetFunctions };
