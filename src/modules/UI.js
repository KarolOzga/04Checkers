import { allNetFunctions } from './Net';

let userName = '';

const allEvents = {
    isUserLogged: false,
    init() {
        let input = document.getElementById('loginBt');
        let nickname = document.getElementById('nicknameInput');
        input.onclick = function () {
            console.log(nickname);
            console.log(nickname.value);

            userName = nickname.value;
            allNetFunctions.loginUser(userName);

            nickname.disabled = true;
        };

        document.getElementById('resetBt').onclick = function () {
            console.log('resetBt');
            nickname.disabled = false;
            nickname.value = '';
            allNetFunctions.resetUsers();
        };
    },
    hello() {
        if (allNetFunctions.isUserOneLogged || allNetFunctions.isUserTwoLogged) {
            let userInfo = document.getElementById('hello');
            userInfo.innerHTML = 'Witaj ' + "<span id='userName'>" + userName + '</span>' + ', grasz ' + (allNetFunctions.isUserOneLogged == '1' ? 'białymi' : 'czarnymi');
        }
    },
    reject() {
        let userInfo = document.getElementById('hello');
        userInfo.innerHTML = 'Wszystkie miejsca zajęte, poczekaj aż skończy się gra, lub ją zresetuj';
        let resetBt = document.getElementById('resetBt');
        resetBt.classList.add('pulse-button');
    },
    sameUser() {
        let userInfo = document.getElementById('hello');
        userInfo.innerHTML = 'Nie możesz grać sam ze sobą';
        let input = document.getElementById('nicknameInput');
        input.disabled = false;
    },
    closeDialog() {
        let dialog = document.getElementById('card');
        dialog.close();
        dialog.style.display = 'none';
        allEvents.isUserLogged = true;
    },
    loading() {
        let loadingPlane = document.createElement('div');
        loadingPlane.classList.add('loadingPlane');
        document.body.appendChild(loadingPlane);

        let loading = document.createElement('div');
        loading.classList.add('loading');
        loadingPlane.appendChild(loading);

        loading.innerText = 'Waiting for second player...';

        let loadingGif = document.createElement('div');
        loadingGif.classList.add('loadingGif');

        loading.appendChild(loadingGif);
    },
    cancelLoading() {
        let loadingPlane = document.querySelector('.loadingPlane');
        if (loadingPlane == null) return;
        loadingPlane.remove();
    },
};

export { allEvents };
