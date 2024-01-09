import { allNetFunctions } from './Net';

const allEvents = {
    init() {
        let input = document.getElementById('loginBt');
        let nickname = document.getElementById('nicknameInput');
        input.onclick = function () {
            console.log(nickname);
            console.log(nickname.value);

            allNetFunctions.loginUser(nickname.value);

            nickname.disabled = true;
        };

        document.getElementById('resetBt').onclick = function () {
            console.log('resetBt');
            nickname.disabled = false;
            nickname.value = '';
            allNetFunctions.resetUsers();
        };
    },
};

export { allEvents };
