import { allNetFunctions } from './Net';
import { client } from './Main';
let userName = '';

const allEvents = {
    isUserLogged: false,
    init() {
        let input = document.getElementById('loginBt');
        let nickname = document.getElementById('nicknameInput');
        input.onclick = function () {
            userName = nickname.value;
            allNetFunctions.loginUser(userName);

            nickname.disabled = true;
        };

        document.getElementById('resetBt').onclick = function () {
            nickname.disabled = false;
            nickname.value = '';
            allNetFunctions.resetUsers();
        };
    },
    hello() {
        if (allNetFunctions.isUserOneLogged || allNetFunctions.isUserTwoLogged) {
            let userInfo = document.getElementById('hello');
            userInfo.innerHTML = 'Witaj ' + "<span class='userName'>" + userName + '</span>' + ', grasz ' + (allNetFunctions.isUserOneLogged == '1' ? 'białymi' : 'czarnymi');
        }
    },

    helloSecondUser(secondUserName) {
        let userInfo = document.getElementById('hello');
        userInfo.innerHTML += '<br />Grasz przeciwko: <span class="userName">' + secondUserName;
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
    selectUser() {
        let user = allNetFunctions.loginData.user;
        return user === 1 ? 'pink' : 'gray';
    },
    waitForSecondPlayerMove(user) {
        // let inWhichPlayerPlane = user === 'pink' ? 'gray' : 'pink';
        let overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        document.body.appendChild(overlay);

        let loading = document.createElement('div');
        loading.style.fontSize = '1.5em';
        loading.style.color = 'white';
        loading.innerText = `Waiting for second player to move...`;
        overlay.appendChild(loading);

        let countdown = document.createElement('div');
        countdown.style.fontSize = '2em';
        countdown.style.color = 'white';
        overlay.appendChild(countdown);

        let timeLeft = 30;
        countdown.innerText = timeLeft;

        let timerId = setInterval(() => {
            timeLeft--;
            countdown.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerId);
                // this.removeOverlay();
                if (overlay) {
                    overlay.parentNode.removeChild(overlay);
                }
                client.emit('timeUp');
            }
        }, 1000);
    },
    removeOverlay() {
        let overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.parentNode.removeChild(overlay);
        }
    },
};

export { allEvents };
