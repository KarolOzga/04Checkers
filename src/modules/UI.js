import { allNetFunctions } from './Net';
let isUserLogged = false;

const allEvents = {
    init() {
        let input = document.getElementById('loginBt');
        let nickname = document.getElementById('nicknameInput');
        input.onclick = function () {
            isUserLogged = true;
            console.log(nickname);
            console.log(nickname.value);

            allNetFunctions.loginUser(nickname.value);

            nickname.disabled = true;
        };

        document.getElementById('resetBt').onclick = function () {
            console.log('resetBt');
            isUserLogged = false;
            nickname.disabled = false;
            nickname.value = '';
            allNetFunctions.resetUsers();
        };
    },
};

export { allEvents };
export { isUserLogged };
