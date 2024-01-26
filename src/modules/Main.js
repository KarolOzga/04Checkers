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
import Field from './Field.js';

import { Raycaster, Vector2 } from 'three';
import { MeshPhongMaterial } from 'three';

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
            const black_plate = new Field(i, 0, j);
            black_plate.material = black_material;
            scene.add(black_plate);
        } else {
            const white_plate = new Field(i, 0, j);
            white_plate.material = white_material;
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

function GeneratePawns(color) {
    let generatePinkIndex = 0;
    let generateGrayIndex = 0;
    if (color === undefined) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (allNetFunctions.isUserOneLogged && pionki[i][j] === 2) {
                    const pawn_pink = new Pawn(pawn_pink_material, i, j, 'pink');
                    scene.add(pawn_pink);
                }
                if (allNetFunctions.isUserTwoLogged && pionki[i][j] === 1) {
                    const pawn_white = new Pawn(pawn_white_material, i, j, 'gray');
                    scene.add(pawn_white);
                }
            }
        }
    } else {
        if (color === 'pink' && generatePinkIndex === 0) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (allNetFunctions.isUserOneLogged && pionki[i][j] === 2) {
                        const pawn_pink = new Pawn(pawn_pink_material, i, j, 'pink');
                        scene.add(pawn_pink);
                    }
                }
            }

            generatePinkIndex = 1;
        }
        if (color === 'gray' && generateGrayIndex === 0) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (allNetFunctions.isUserTwoLogged && pionki[i][j] === 1) {
                        const pawn_white = new Pawn(pawn_white_material, i, j, 'gray');
                        scene.add(pawn_white);
                    }
                }
            }

            generateGrayIndex = 1;
        }
    }
}

const raycaster = new Raycaster();
const mouse = new Vector2();

window.addEventListener(
    'click',
    (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        if (allNetFunctions.isUserOneLogged || allNetFunctions.isUserTwoLogged) {
            performRaycast();
        }
    },
    false
);

let selectedPawn = null;
let selectedField = null;

let currentUser;

function setCorrectUserPawnColor() {
    console.log('{ULTRA DEBUG}', allNetFunctions.isUserOneLogged, allNetFunctions.isUserTwoLogged);
    if (allNetFunctions.isUserOneLogged || allNetFunctions.isUserTwoLogged) {
        currentUser = allEvents.selectUser();
        console.log('{ULTRA DEBUG}', currentUser);
        performRaycast();
    } else {
        currentUser = null;
    }
}

function performRaycast() {
    raycaster.setFromCamera(mouse, camera.threeCamera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.isPawn && !selectedPawn) {
            // Select a pawn
            if (selectedPawn) {
                selectedPawn.material = selectedPawn.originalMaterial; // Reset the material of the previously selected pawn
            }
            const selectedMaterial = new MeshPhongMaterial({ color: 0xff0000 }); // Create a new material with the desired color
            intersectedObject.originalMaterial = intersectedObject.material; // Store the original material
            intersectedObject.material = selectedMaterial; // Apply the new material
            selectedPawn = intersectedObject; // Store the selected pawn
        } else if (intersectedObject.isField && selectedPawn) {
            // Move the selected pawn to the selected field
            selectedPawn.position.set(intersectedObject.position.x, 0.25, intersectedObject.position.z);
            selectedPawn.material = selectedPawn.originalMaterial; // Reset the material of the selected pawn
            selectedPawn = null; // Deselect the pawn
        }
    }
}

export { setCorrectUserPawnColor };
export { GeneratePawns };
export { GameObject };
export { camera };
