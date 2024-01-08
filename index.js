import { allEvents } from './src/modules/UI.js';
import { GameObject } from './src/modules/Main.js';

GameObject.render();

allEvents.init();

window.addEventListener('DOMContentLoaded', () => {
    let dialog = document.getElementById('card');
    dialog.showModal();
});
