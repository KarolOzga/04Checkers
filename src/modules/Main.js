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
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const textureLoader = new THREE.TextureLoader();
const black_texture = textureLoader.load('/src/img/textures/black_board_texture.png');
const white_texture = textureLoader.load('/src/img/textures/white_board_texture.png');

const geometry = new THREE.BoxGeometry(1, 0.5, 1);

const black_material = new THREE.MeshBasicMaterial({ map: black_texture });
const white_material = new THREE.MeshBasicMaterial({ map: white_texture });

// const black_plate = new THREE.Mesh(geometry, black_material);
// const white_plate = new THREE.Mesh(geometry, white_material);

// scene.add(cube);

const szachownica = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
];

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        if (szachownica[i][j] === 1) {
            const black_plate = new THREE.Mesh(geometry, black_material);
            black_plate.position.set(i, 0, j);
            scene.add(black_plate);
        } else {
            const white_plate = new THREE.Mesh(geometry, white_material);
            white_plate.position.set(i, 0, j);
            scene.add(white_plate);
        }
    }
}

const pionki = [
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
];

const CylinderGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);

export { GameObject };
