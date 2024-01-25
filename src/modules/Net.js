import { GameObject } from './Main.js';
import { camera } from './Main.js';
import { GeneratePawns } from './Main.js';
import { allEvents } from './UI.js';

const allNetFunctions = {
    isUserOneLogged: false,
    isUserTwoLogged: false,

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
                console.log(response.status);
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
                this.whichPlayer(userNameAsParametr);
                GameObject.setPlayer(data);
                console.log(data);
                if (data.user === 1) {
                    allNetFunctions.isUserOneLogged = true;
                    allEvents.hello();
                    GeneratePawns();
                    allEvents.loading();
                    camera.setCameraPosition(-5, 5, 3);
                    camera.setLookAt(4, 0, 3);
                } else if (data.user === 2) {
                    allNetFunctions.isUserTwoLogged = true;
                    GeneratePawns();
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
                    console.log(data.users);
                    if (data.player === 1) {
                        this.isUserOneLogged = true;
                        this.isUserTwoLogged = false;
                        GeneratePawns();
                    } else if (data.player === 2) {
                        allEvents.loading();
                        allEvents.cancelLoading();
                        // Display the opponent's username
                        allEvents.helloSecondUser(data.users.find((user) => user.userName !== userName).userName);
                        this.isUserOneLogged = true;
                        this.isUserTwoLogged = true;
                        GeneratePawns();
                        clearInterval(interval);
                    }
                    if (this.isUserOneLogged && this.isUserTwoLogged) {
                        allEvents.cancelLoading();
                    }
                    console.log(data.player);
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
                }, 2000);

                allEvents.isUserLogged = false;
                camera.setCameraPosition(3.65, 5, 12);
                console.log(data.message);
            })
            .catch((error) => console.log(error));
    },
};

export { allNetFunctions };
