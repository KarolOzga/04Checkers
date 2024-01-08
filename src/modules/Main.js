import * as THREE from 'three';
import Renderer from './Renderer.js';
import Camera from './Camera.js';
import { Scene } from 'three';

const container = document.getElementById('root');
const scene = new Scene();
const renderer = new Renderer(scene, container);
const camera = new Camera(renderer.threeRenderer);

const GameObject = {
    player1: null,
    player2: null,

    render() {
        renderer.render(scene, camera.threeCamera);
        // ico.update()

        requestAnimationFrame(GameObject.render);
    },
    setPlayer(player) {
        if (this.player1 === null) {
            this.player1 = player;
        } else if (this.player2 === null && this.player1 !== null) {
            this.player2 = player;
        } else {
            console.log('Oba miejsca zajęte, zresetuj grę by zwolnić miejsca');
        }
        console.log(this.player1, this.player2);
    },
};

let board = [];

export { GameObject };
