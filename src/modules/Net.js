import { GameObject } from './Main.js';
import { camera } from './Main.js';
import { GeneratePawns } from './Main.js';
import { allEvents } from './UI.js';

const allNetFunctions = {
    isUserOneLogged: false,
    isUserTwoLogged: false,

    loginUser(userName) {
        fetch('http://localhost:3000/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName: userName }),
        })
            .then((response) => {
                if (!response.ok) {
                    allEvents.reject();
                    throw new Error('Oba miejsca zajęte, zresetuj grę by zwolnić miejsca.');
                } else {
                    allEvents.closeDialog();
                }
                return response.json();
            })
            .then((data) => {
                GameObject.setPlayer(data);
                console.log(data);
                if (data.user === 1) {
                    allNetFunctions.isUserOneLogged = true;
                    allEvents.hello();
                    GeneratePawns();

                    camera.setCameraPosition(-5, 5, 3);
                    camera.setLookAt(4, 0, 3);
                } else if (data.user === 2) {
                    allNetFunctions.isUserTwoLogged = true;
                    GeneratePawns();
                    allEvents.hello();
                    camera.setCameraPosition(12, 5, 3);
                    camera.setLookAt(4, 0, 3);
                }
            })
            .catch((error) => console.log(error));
    },

    resetUsers() {
        fetch('http://localhost:3000/resetUsers', {
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
