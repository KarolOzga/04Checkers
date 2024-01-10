import { GameObject } from './Main.js';
import { camera } from './Main.js';
import { GeneratePawns } from './Main.js';

let isUserOneLogged = false;
let isUserTwoLogged = false;

const allNetFunctions = {
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
                    throw new Error('Oba miejsca zajęte, zresetuj grę by zwolnić miejsca.');
                } else {
                    let dialog = document.getElementById('card');
                    dialog.close();
                    dialog.style.display = 'none';
                }
                return response.json();
            })
            .then((data) => {
                GameObject.setPlayer(data);
                console.log(data);
                if (data.user === 1) {
                    isUserOneLogged = true;
                    GeneratePawns();

                    camera.setCameraPosition(-5, 5, 3);
                    camera.setLookAt(4, 0, 3);
                } else if (data.user === 2) {
                    isUserTwoLogged = true;
                    GeneratePawns();

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
                camera.setCameraPosition(3.65, 5, 12);
                // camera.setLookAt(3.65, 0, 0);
                console.log(data.message);
            })
            .catch((error) => console.log(error));
    },
};

export { isUserOneLogged, isUserTwoLogged };
export { allNetFunctions };
