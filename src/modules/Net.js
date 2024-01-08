import { GameObject } from './Main';

const allNetFunctions = {
    loginUser(userName) {
        fetch('http://localhost:3000/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName: userName }),
        })
            .then((response) => response.json())
            .then((data) => {
                GameObject.setPlayer(data);
                // console.log(GameObject);
            })
            .catch((error) => console.log(error));
    },
    resetUsers() {
        fetch('/resetUsers', options)
            .then((response) => response.json())
            .then((data) => {
                // działania po resecie
            })
            .catch((error) => console.log(error));
    },
};

export { allNetFunctions };
