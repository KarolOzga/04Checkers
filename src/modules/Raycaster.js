import * as THREE from 'three';
import { allNetFunctions } from './Net';
import { client } from './Main';
import TWEEN from '@tweenjs/tween.js';
import black_board_texture from '../img/textures/black_board_texture.png';
import { uniquePawnList } from './Main';

export default class Raycaster {
    constructor(threeCamera, scene, currentUser) {
        this.raycaster = new THREE.Raycaster();
        this.threeCamera = threeCamera;
        this.scene = scene;
        this.currentUser = currentUser;
        this.selectedPawn = null;

        this.textureLoader = new THREE.TextureLoader();
        this.black_texture = this.textureLoader.load(black_board_texture);
        this.black_material = new THREE.MeshBasicMaterial({ map: this.black_texture });

        this.killedPawn = null;
    }

    performRaycast(mouse) {
        this.raycaster.setFromCamera(mouse, this.threeCamera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            if (intersectedObject.isPawn && intersectedObject.owner === this.currentUser) {
                this.clearGreenFields();

                if (this.selectedPawn) {
                    this.selectedPawn.material = this.selectedPawn.originalMaterial;
                }

                const selectedMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

                let acceptableField = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

                if (
                    intersectedObject.position.x + 1 < allNetFunctions.fields2D.length &&
                    intersectedObject.position.z - 1 >= 0 &&
                    allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1] &&
                    allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1].isFree &&
                    intersectedObject.owner === 'pink'
                ) {
                    if (!allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1].originalMaterial) {
                        allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1].originalMaterial =
                            allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1].material;
                    }
                    allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1].material = acceptableField;
                }
                if (
                    intersectedObject.position.x + 1 < allNetFunctions.fields2D.length &&
                    intersectedObject.position.z + 1 < allNetFunctions.fields2D[0].length &&
                    allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1] &&
                    allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1].isFree &&
                    intersectedObject.owner === 'pink'
                ) {
                    if (!allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1].originalMaterial) {
                        allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1].originalMaterial =
                            allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1].material;
                    }
                    allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1].material = acceptableField;
                }
                if (
                    intersectedObject.position.x - 1 >= 0 &&
                    intersectedObject.position.z - 1 >= 0 &&
                    allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1] &&
                    allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1].isFree &&
                    intersectedObject.owner === 'gray'
                ) {
                    if (!allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1].originalMaterial) {
                        allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1].originalMaterial =
                            allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1].material;
                    }
                    allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1].material = acceptableField;
                }
                if (
                    intersectedObject.position.x - 1 >= 0 &&
                    intersectedObject.position.z + 1 < allNetFunctions.fields2D[0].length &&
                    allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1] &&
                    allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].isFree &&
                    intersectedObject.owner === 'gray'
                ) {
                    if (!allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].originalMaterial) {
                        allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].originalMaterial =
                            allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].material;
                    }
                    allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].material = acceptableField;
                }

                if (intersectedObject.owner === 'pink') {
                    let x = intersectedObject.position.x + 2;
                    let z = intersectedObject.position.z + 2;
                    if (x < allNetFunctions.fields2D.length && z < allNetFunctions.fields2D[0].length && allNetFunctions.fields2D[x][z] != undefined) {
                        if (
                            allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1] &&
                            allNetFunctions.fields2D[intersectedObject.position.x + 2][intersectedObject.position.z + 2] &&
                            !allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1].isFree &&
                            allNetFunctions.fields2D[intersectedObject.position.x + 2][intersectedObject.position.z + 2].isFree
                        ) {
                            for (let i = 0; i < uniquePawnList.length; i++) {
                                if (uniquePawnList[i].position.x === intersectedObject.position.x + 1 && uniquePawnList[i].position.z === intersectedObject.position.z + 1) {
                                    let killedPawn = uniquePawnList[i];

                                    if (killedPawn && killedPawn.owner === 'gray') {
                                        allNetFunctions.fields2D[intersectedObject.position.x + 2][intersectedObject.position.z + 2].material = acceptableField;
                                    }
                                }
                            }
                        }
                    }

                    let x2 = intersectedObject.position.x + 2;
                    let z2 = intersectedObject.position.z - 2;
                    if (x2 < allNetFunctions.fields2D.length && z2 >= 0 && allNetFunctions.fields2D[x2][z2] != undefined) {
                        if (
                            allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1] &&
                            allNetFunctions.fields2D[intersectedObject.position.x + 2][intersectedObject.position.z - 2] &&
                            !allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1].isFree &&
                            allNetFunctions.fields2D[intersectedObject.position.x + 2][intersectedObject.position.z - 2].isFree
                        ) {
                            for (let i = 0; i < uniquePawnList.length; i++) {
                                if (uniquePawnList[i].position.x === intersectedObject.position.x + 1 && uniquePawnList[i].position.z === intersectedObject.position.z - 1) {
                                    let killedPawn = uniquePawnList[i];

                                    if (killedPawn && killedPawn.owner === 'gray') {
                                        allNetFunctions.fields2D[intersectedObject.position.x + 2][intersectedObject.position.z - 2].material = acceptableField;
                                    }
                                }
                            }
                            // allNetFunctions.fields2D[intersectedObject.position.x + 2][intersectedObject.position.z - 2].material = acceptableField;
                        }
                    }
                }

                if (intersectedObject.owner === 'gray') {
                    let x = intersectedObject.position.x - 2;
                    let z = intersectedObject.position.z - 2;
                    if (x >= 0 && z >= 0 && allNetFunctions.fields2D[x][z] != undefined) {
                        if (
                            allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1] &&
                            allNetFunctions.fields2D[intersectedObject.position.x - 2][intersectedObject.position.z - 2] &&
                            !allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1].isFree &&
                            allNetFunctions.fields2D[intersectedObject.position.x - 2][intersectedObject.position.z - 2].isFree
                        ) {
                            for (let i = 0; i < uniquePawnList.length; i++) {
                                if (uniquePawnList[i].position.x === intersectedObject.position.x - 1 && uniquePawnList[i].position.z === intersectedObject.position.z - 1) {
                                    let killedPawn = uniquePawnList[i];
                                    if (killedPawn && killedPawn.owner === 'pink') {
                                        allNetFunctions.fields2D[intersectedObject.position.x - 2][intersectedObject.position.z - 2].material = acceptableField;
                                    }
                                }
                            }
                        }
                    }

                    let x2 = intersectedObject.position.x - 2;
                    let z2 = intersectedObject.position.z + 2;
                    if (x2 >= 0 && z2 < allNetFunctions.fields2D[0].length && allNetFunctions.fields2D[x2][z2] != undefined) {
                        if (
                            allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1] &&
                            allNetFunctions.fields2D[intersectedObject.position.x - 2][intersectedObject.position.z + 2] &&
                            !allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].isFree &&
                            allNetFunctions.fields2D[intersectedObject.position.x - 2][intersectedObject.position.z + 2].isFree
                        ) {
                            for (let i = 0; i < uniquePawnList.length; i++) {
                                if (uniquePawnList[i].position.x === intersectedObject.position.x - 1 && uniquePawnList[i].position.z === intersectedObject.position.z + 1) {
                                    let killedPawn = uniquePawnList[i];
                                    if (killedPawn && killedPawn.owner === 'pink') {
                                        allNetFunctions.fields2D[intersectedObject.position.x - 2][intersectedObject.position.z + 2].material = acceptableField;
                                    }
                                }
                            }
                            // allNetFunctions.fields2D[intersectedObject.position.x - 2][intersectedObject.position.z + 2].material = acceptableField;
                        }
                    }
                }

                intersectedObject.originalMaterial = intersectedObject.material;
                intersectedObject.material = selectedMaterial;
                this.selectedPawn = intersectedObject;
            } else if (intersectedObject.isField && intersectedObject.isBlack && this.selectedPawn && intersectedObject.isFree) {
                this.movePawn(intersectedObject);
            } else if (!intersectedObject.isFree) {
            }
        }
    }

    movePawn(intersectedObject) {
        const dx = Math.abs(this.selectedPawn.position.x - intersectedObject.position.x);
        const dz = Math.abs(this.selectedPawn.position.z - intersectedObject.position.z);

        let withoutABSX = this.selectedPawn.position.x - intersectedObject.position.x;
        let withoutABSZ = this.selectedPawn.position.z - intersectedObject.position.z;

        if (this.currentUser === 'pink') {
            withoutABSX = -withoutABSX;
            withoutABSZ = -withoutABSZ;
        }

        allNetFunctions.fields2D[Math.ceil(parseInt(this.selectedPawn.position.x))][Math.ceil(parseInt(this.selectedPawn.position.z))].isFree = true;

        if (withoutABSX > 0 && withoutABSX <= 1 && dx === 1 && dz === 1) {
            console.log('MOVE BY ONE STEP');

            new TWEEN.Tween(this.selectedPawn.position)
                .to(
                    {
                        x: intersectedObject.position.x,
                        z: intersectedObject.position.z,
                    },
                    500
                )
                .start();

            new TWEEN.Tween(this.selectedPawn.position)
                .to({ y: 1 }, 250)
                .chain(
                    new TWEEN.Tween(this.selectedPawn.position).to({ y: 0.35 }, 250).onComplete(() => {
                        this.selectedPawn.material = this.selectedPawn.originalMaterial;

                        const pawnId = this.selectedPawn.pawnId;
                        const newPosition = { ...this.selectedPawn.position };

                        allNetFunctions.fields2D[this.selectedPawn.position.x][this.selectedPawn.position.z].isFree = false;

                        this.selectedPawn = null;

                        this.clearGreenFields();

                        client.emit('pawnMoved', { pawnId, newPosition });

                        allNetFunctions.setPlayerMove(pawnId);
                        allNetFunctions.getPlayerMove();
                    })
                )
                .start();
        } else if (intersectedObject.isFree && intersectedObject.isBlack && intersectedObject.isField && dx === 2 && dz === 2) {
            let isPawnNotKilled = true;

            if (
                this.selectedPawn.owner === 'pink' &&
                allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1] != undefined &&
                isPawnNotKilled
            ) {
                console.log(intersectedObject.position, 'POSITION OF INTERSECTED OBJECT');
                // debugger;

                if (!allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1].isFree) {
                    console.log('CZY SKURCZYBYM JEST WOLNY 1');

                    if (this.findGrayPawnToBeKilled(intersectedObject) === 'gray') {
                        this.animateMove(intersectedObject);
                        allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1].isFree = true;
                        console.log('DEBUG PINK 1');

                        for (let i = 0; i < uniquePawnList.length; i++) {
                            if (uniquePawnList[i].position.x === intersectedObject.position.x - 1 && uniquePawnList[i].position.z === intersectedObject.position.z - 1) {
                                // uniquePawnList[i].position.y = -3;
                                client.emit('pawnKilled', { pawnId: uniquePawnList[i].pawnId, position: uniquePawnList[i].position });
                                this.killPawn(uniquePawnList[i]);
                                isPawnNotKilled = false;
                            }
                        }
                    }
                } else {
                    console.log('no pawn to kill');
                }
            }
            if (
                this.selectedPawn.owner === 'pink' &&
                allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1] != undefined &&
                isPawnNotKilled
            ) {
                console.log(intersectedObject.position, 'POSITION OF INTERSECTED OBJECT');
                if (!allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].isFree) {
                    console.log('CZY SKURCZYBYM JEST WOLNY 2');
                    if (this.findGrayPawnToBeKilled(intersectedObject) === 'gray') {
                        this.animateMove(intersectedObject);

                        console.log('DEBUG PINK 2');

                        allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].isFree = true;
                        for (let i = 0; i < uniquePawnList.length; i++) {
                            if (uniquePawnList[i].position.x === intersectedObject.position.x - 1 && uniquePawnList[i].position.z === intersectedObject.position.z + 1) {
                                // uniquePawnList[i].position.y = -3;

                                client.emit('pawnKilled', { pawnId: uniquePawnList[i].pawnId, position: uniquePawnList[i].position });
                                this.killPawn(uniquePawnList[i]);
                                isPawnNotKilled = false;
                            }
                        }
                    }
                } else {
                    console.log('no pawn to kill');
                }
            }

            if (
                this.selectedPawn.owner === 'gray' &&
                allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1] != undefined &&
                isPawnNotKilled
            ) {
                if (!allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1].isFree) {
                    console.log(allNetFunctions.fields2D);
                    if (this.findPinkPawnToBeKilled(intersectedObject) === 'pink') {
                        this.animateMove(intersectedObject);

                        console.log('DEBUG GRAY 1');

                        allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1].isFree = true;
                        for (let i = 0; i < uniquePawnList.length; i++) {
                            if (uniquePawnList[i].position.x === intersectedObject.position.x + 1 && uniquePawnList[i].position.z === intersectedObject.position.z - 1) {
                                // uniquePawnList[i].position.y = -3;
                                client.emit('pawnKilled', { pawnId: uniquePawnList[i].pawnId, position: uniquePawnList[i].position });
                                this.killPawn(uniquePawnList[i]);
                                isPawnNotKilled = false;
                            }
                        }
                    }
                } else {
                    console.log('no pawn to kill');
                }
            }
            if (
                this.selectedPawn.owner === 'gray' &&
                allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1] != undefined &&
                isPawnNotKilled
            ) {
                if (!allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1].isFree) {
                    if (this.findPinkPawnToBeKilled(intersectedObject) === 'pink') {
                        console.log('DE BUGGGGGG GRAY2');

                        this.animateMove(intersectedObject);
                        allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1].isFree = true;
                        for (let i = 0; i < uniquePawnList.length; i++) {
                            if (uniquePawnList[i].position.x === intersectedObject.position.x + 1 && uniquePawnList[i].position.z === intersectedObject.position.z + 1) {
                                // uniquePawnList[i].position.y = -3;

                                client.emit('pawnKilled', { pawnId: uniquePawnList[i].pawnId, position: uniquePawnList[i].position });
                                this.killPawn(uniquePawnList[i]);
                                isPawnNotKilled = false;
                            }
                        }
                    }
                } else {
                    console.log('no pawn to kill');
                }
            }
        }
    }

    clearGreenFields() {
        for (let i = 0; i < allNetFunctions.fields2D.length; i++) {
            for (let j = 0; j < allNetFunctions.fields2D[i].length; j++) {
                let color = allNetFunctions.fields2D[i][j].material.color;
                if (color.r == 0 && color.g == 1 && color.b == 0) {
                    allNetFunctions.fields2D[i][j].material = this.black_material;
                }
            }
        }
    }
    animateMove(intersectedObject) {
        this.clearGreenFields();

        if (this.selectedPawn && this.selectedPawn.originalMaterial) {
            new TWEEN.Tween(this.selectedPawn.position)
                .to(
                    {
                        x: intersectedObject.position.x,
                        z: intersectedObject.position.z,
                    },
                    500
                )
                .start();

            new TWEEN.Tween(this.selectedPawn.position)
                .to({ y: 1 }, 250)
                .chain(
                    new TWEEN.Tween(this.selectedPawn.position).to({ y: 0.35 }, 250).onComplete(() => {
                        if (this.selectedPawn) {
                            this.selectedPawn.material = this.selectedPawn.originalMaterial;
                            const pawnId = this.selectedPawn.pawnId;
                            const newPosition = { ...this.selectedPawn.position };

                            allNetFunctions.fields2D[this.selectedPawn.position.x][this.selectedPawn.position.z].isFree = false;

                            this.selectedPawn = null;

                            this.clearGreenFields();

                            client.emit('pawnMoved', { pawnId, newPosition });

                            allNetFunctions.setPlayerMove(pawnId);
                            allNetFunctions.getPlayerMove();
                        }
                    })
                )
                .start();
        }
    }

    findGrayPawnToBeKilled(intersectedObject) {
        for (let i = 0; i < uniquePawnList.length; i++) {
            if (
                uniquePawnList[i].position.x === intersectedObject.position.x - 1 &&
                uniquePawnList[i].position.z === intersectedObject.position.z - 1 &&
                uniquePawnList[i].position.z - 1 === this.selectedPawn.position.z &&
                uniquePawnList[i].position.x - 1 === this.selectedPawn.position.x
            ) {
                let killedPawn = uniquePawnList[i];

                return killedPawn.owner;
            } else if (
                uniquePawnList[i].position.x === intersectedObject.position.x - 1 &&
                uniquePawnList[i].position.z === intersectedObject.position.z + 1 &&
                uniquePawnList[i].position.z + 1 === this.selectedPawn.position.z &&
                uniquePawnList[i].position.x - 1 === this.selectedPawn.position.x
            ) {
                let killedPawn = uniquePawnList[i];

                return killedPawn.owner;
            }
        }
    }

    findPinkPawnToBeKilled(intersectedObject) {
        for (let i = 0; i < uniquePawnList.length; i++) {
            if (uniquePawnList[i].position.x === intersectedObject.position.x + 1 && uniquePawnList[i].position.z === intersectedObject.position.z - 1) {
                let killedPawn = uniquePawnList[i];

                return killedPawn.owner;
            } else if (uniquePawnList[i].position.x === intersectedObject.position.x + 1 && uniquePawnList[i].position.z === intersectedObject.position.z + 1) {
                let killedPawn = uniquePawnList[i];

                return killedPawn.owner;
            }
        }
    }

    killPawn(pawn) {
        const killedPawn = this.scene.children.find((child) => child.isPawn && child.pawnId === pawn.pawnId);
        if (killedPawn) {
            allNetFunctions.fields2D[killedPawn.position.x][killedPawn.position.z].isFree = true;
            const upTween = new TWEEN.Tween(killedPawn.position).to({ y: 1.5 }, 300).easing(TWEEN.Easing.Quadratic.Out);

            const flipTween = new TWEEN.Tween(killedPawn.rotation).to({ x: Math.PI }, 300);

            const downTween = new TWEEN.Tween(killedPawn.position).to({ y: 0 }, 300);

            setTimeout(() => {
                upTween.start();
            }, 500);

            upTween.onComplete(() => {
                flipTween.start();
                downTween.start();
            });

            downTween.onComplete(() => this.scene.remove(killedPawn));
        }
    }
}
