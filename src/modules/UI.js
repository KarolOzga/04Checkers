import { allNetFunctions } from './Net';

const allEvents = {
    init() {
        let input = document.getElementById('loginBt');
        input.onclick = function () {
            let nickname = document.getElementById('nicknameInput');
            console.log(nickname);
            console.log(nickname.value);

            allNetFunctions.loginUser(nickname.value);
        };

        document.getElementById('resetBt').onclick = function () {
            console.log('resetBt');

            allNetFunctions.resetUsers();
        };
    },
};

export { allEvents };
