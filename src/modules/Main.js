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
import * as TWEEN from '@tweenjs/tween.js';

import { io } from 'https://cdn.socket.io/4.6.0/socket.io.esm.min.js';
const client = io('ws://192.168.0.171:3000');

window.addEventListener('DOMContentLoaded', () => {
    client.on('connect', () => {
        console.log('Połączono z serwerem');
    });
});
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
        TWEEN.update();
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
            const black_plate = new Field(i, 0, j, true);
            black_plate.material = black_material;
            scene.add(black_plate);
        } else {
            const white_plate = new Field(i, 0, j, false);
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

let pawnId0 = 0;
let pawnId1 = 8;

let pawnList = [];
let uniquePawnList = [];

function GeneratePawns(color) {
    let generatePinkIndex = 0;
    let generateGrayIndex = 0;
    if (color === 'pink' && generatePinkIndex === 0) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (allNetFunctions.isUserOneLogged && pionki[i][j] === 2) {
                    const pawn_pink = new Pawn(pawn_pink_material, i, j, 'pink', pawnId0++);
                    pawn_pink.user = 'pink';
                    pawnList.push(pawn_pink);
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
                    const pawn_white = new Pawn(pawn_white_material, i, j, 'gray', pawnId1++);
                    pawn_white.user = 'gray';
                    pawnList.push(pawn_white);
                    scene.add(pawn_white);
                }
            }
        }

        generateGrayIndex = 1;
    }
    uniquePawnList = Array.from(new Set(pawnList));
    console.log(uniquePawnList, 'unikatowe pionki');
}

const raycaster = new Raycaster();
const mouse = new Vector2();

let wait = null;

window.addEventListener(
    'click',
    (event) => {
        if (wait) {
            clearTimeout(wait);
        }
        wait = setTimeout(() => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            if (allNetFunctions.isUserOneLogged || allNetFunctions.isUserTwoLogged) {
                performRaycast();
            }
        }, 100);
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

client.on('pawnMoved', (data) => {
    console.log('Received pawnMoved event', data);
    // Find the pawn with the given ID.
    console.log(currentUser, 'CURRENT USER');

    const pawn = scene.children.find((child) => child.isPawn && child.pawnId === data.pawnId);

    console.log('PAWNEK', pawn);

    if (!pawn) {
        console.error('Could not find pawn with ID', data.id);
        return;
    }
    // pawn.position.x = data.newPosition.x;
    // pawn.position.z = data.newPosition.z;
    new TWEEN.Tween(pawn.position)
        .to(
            {
                x: data.newPosition.x,
                z: data.newPosition.z,
            },
            500
        )
        .start();

    new TWEEN.Tween(pawn.position)
        .to({ y: 1 }, 250)
        .chain(
            new TWEEN.Tween(pawn.position).to({ y: 0.35 }, 250).onComplete(() => {
                // pawn.material = pawn.originalMaterial;
                // const pawnId = pawn.pawnId;
                // const newPosition = { ...pawn.position };
                // pawn = null;
                // client.emit('pawnMoved', { pawnId, newPosition });
            })
        )
        .start();

    console.log('NEW PAWNEK', pawn);
    // Update the pawn's position.
    // new TWEEN.Tween(pawn.position)
    //     .to(
    //         {
    //             x: data.newPosition.x,
    //             z: data.newPosition.z,
    //         },
    //         500
    //     )
    //     .start();
    // new TWEEN.Tween(pawn.position)
    //     .to({ y: 1 }, 250)
    //     .chain(new TWEEN.Tween(pawn.position).to({ y: 0.3 }, 250))
    //     .onComplete(() => {
    //         pawn.material = pawn.originalMaterial;
    //     })
    //     .start();
});

function performRaycast() {
    raycaster.setFromCamera(mouse, camera.threeCamera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.isPawn && intersectedObject.owner === currentUser) {
            if (selectedPawn) {
                selectedPawn.material = selectedPawn.originalMaterial;
            }
            const selectedMaterial = new MeshPhongMaterial({ color: 0xff0000 });
            intersectedObject.originalMaterial = intersectedObject.material;
            intersectedObject.material = selectedMaterial;
            selectedPawn = intersectedObject;
        } else if (intersectedObject.isField && intersectedObject.isBlack && selectedPawn) {
            const dx = Math.abs(selectedPawn.position.x - intersectedObject.position.x);
            const dz = Math.abs(selectedPawn.position.z - intersectedObject.position.z);
            if (dx <= 1 && dz <= 1) {
                new TWEEN.Tween(selectedPawn.position)
                    .to(
                        {
                            x: intersectedObject.position.x,
                            z: intersectedObject.position.z,
                        },
                        500
                    )
                    .start();

                new TWEEN.Tween(selectedPawn.position)
                    .to({ y: 1 }, 250)
                    .chain(
                        new TWEEN.Tween(selectedPawn.position).to({ y: 0.35 }, 250).onComplete(() => {
                            selectedPawn.material = selectedPawn.originalMaterial;
                            const pawnId = selectedPawn.pawnId;
                            const newPosition = { ...selectedPawn.position };
                            selectedPawn = null;
                            client.emit('pawnMoved', { pawnId, newPosition });
                        })
                    )
                    .start();
            } else {
                console.log('Invalid move. Pawns can only move one field at a time.');
            }
        }
    }
}

export { setCorrectUserPawnColor };
export { GeneratePawns };
export { GameObject };
export { camera };
