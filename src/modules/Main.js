import * as THREE from 'three';
import Renderer from './Renderer.js';
import Camera from './Camera.js';
import { Scene } from 'three';

import black_board_texture from '../img/textures/black_board_texture.png';
import white_board_texture from '../img/textures/white_board_texture.png';
import pink_pawn_texture from '../img/textures/pink_pawn_texture.png';
import white_pawn_texture from '../img/textures/white_pawn_texture.png';

import { allNetFunctions } from './Net.js';
import { allEvents } from './UI.js';

import Pawn from './Pawn.js';

const container = document.getElementById('root');
const scene = new Scene();
const renderer = new Renderer(scene, container);
const camera = new Camera(renderer.threeRenderer);

const GameObject = {
    player1: null,
    player2: null,

    render() {
        if (!allEvents.isUserLogged) {
            const time = Date.now() * 0.0001;
            const radius = 10;
            const boardCenterX = 3.5;
            const boardCenterY = 0;
            const boardCenterZ = 3.5;
            camera.moveInCircle(time, radius, boardCenterX, boardCenterY, boardCenterZ);
        }
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
const black_texture = textureLoader.load(black_board_texture);
const white_texture = textureLoader.load(white_board_texture);

const pawnPinkTexture = textureLoader.load(pink_pawn_texture);
const pawnWhiteTexture = textureLoader.load(white_pawn_texture);

const geometry = new THREE.BoxGeometry(1, 0.5, 1);

const black_material = new THREE.MeshBasicMaterial({ map: black_texture });
const white_material = new THREE.MeshBasicMaterial({ map: white_texture });
const pawn_pink_material = new THREE.MeshBasicMaterial({ map: pawnPinkTexture });
const pawn_white_material = new THREE.MeshBasicMaterial({ map: pawnWhiteTexture });

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
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
];

function GeneratePawns() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (allNetFunctions.isUserOneLogged && pionki[i][j] === 2) {
                const pawn_pink = new Pawn(pawn_pink_material, i, j);
                scene.add(pawn_pink);
            }
            if (allNetFunctions.isUserTwoLogged && pionki[i][j] === 1) {
                const pawn_white = new Pawn(pawn_white_material, i, j);
                scene.add(pawn_white);
            }
            if (allNetFunctions.isUserOneLogged && allNetFunctions.isUserTwoLogged) {
                if (pionki[i][j] === 1) {
                    const pawn_white = new Pawn(pawn_white_material, i, j);
                    scene.add(pawn_white);
                }
                if (pionki[i][j] === 2) {
                    const pawn_pink = new Pawn(pawn_pink_material, i, j);
                    scene.add(pawn_pink);
                }
            }
        }
    }
}

export { GeneratePawns };
export { GameObject };
export { camera };
