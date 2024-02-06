import * as THREE from 'three';
import { allNetFunctions } from './Net';
import { client } from './Main';
import TWEEN from '@tweenjs/tween.js';

export default class Raycaster {
    constructor(threeCamera, scene, currentUser) {
        this.raycaster = new THREE.Raycaster();
        this.threeCamera = threeCamera;
        this.scene = scene;
        this.currentUser = currentUser;
        this.selectedPawn = null;
    }

    performRaycast(mouse) {
        this.raycaster.setFromCamera(mouse, this.threeCamera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            if (intersectedObject.isPawn && intersectedObject.owner === this.currentUser) {
                this.clearGreenFields(); ///TUTAJ JEST PROBLEM

                if (this.selectedPawn) {
                    this.selectedPawn.material = this.selectedPawn.originalMaterial;
                } else {
                    console.error('selectedPawn is null');
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
                    if (
                        !allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1].isFree &&
                        allNetFunctions.fields2D[intersectedObject.position.x + 2][intersectedObject.position.z + 2].isFree
                    ) {
                        allNetFunctions.fields2D[intersectedObject.position.x + 2][intersectedObject.position.z + 2].material = acceptableField;
                    }
                }

                if (intersectedObject.owner === 'gray') {
                    if (
                        !allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1].isFree &&
                        allNetFunctions.fields2D[intersectedObject.position.x - 2][intersectedObject.position.z - 2].isFree
                    ) {
                        allNetFunctions.fields2D[intersectedObject.position.x - 2][intersectedObject.position.z - 2].material = acceptableField;
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
        allNetFunctions.fields2D[this.selectedPawn.position.x][this.selectedPawn.position.z].isFree = true;

        if (withoutABSX >= 0) {
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

                        // this.clearGreenFields();

                        client.emit('pawnMoved', { pawnId, newPosition });

                        allNetFunctions.setPlayerMove(pawnId);
                        allNetFunctions.getPlayerMove();
                    })
                )
                .start();
        } else {
        }

        // if (dx === 2 && dz === 2) {
        //     const opponentPawnX = (this.selectedPawn.position.x + intersectedObject.position.x) / 2;
        //     const opponentPawnZ = (this.selectedPawn.position.z + intersectedObject.position.z) / 2;
        //     const opponentPawn = allNetFunctions.fields2D[opponentPawnX][opponentPawnZ].pawn;
        //     if (opponentPawn && opponentPawn.owner !== this.currentUser) {
        //         this.scene.remove(opponentPawn);
        //         allNetFunctions.fields2D[opponentPawnX][opponentPawnZ].isFree = true;
        //         allNetFunctions.fields2D[opponentPawnX][opponentPawnZ].pawn = null;
        //     }
        // }
    }

    clearGreenFields() {
        for (let i = 0; i < allNetFunctions.fields2D.length; i++) {
            for (let j = 0; j < allNetFunctions.fields2D[i].length; j++) {
                if (allNetFunctions.fields2D[i][j].material) {
                    let color = allNetFunctions.fields2D[i][j].material.color;
                    if (color.r === 0 && color.g === 1 && color.b === 0) {
                        allNetFunctions.fields2D[i][j].material = allNetFunctions.fields2D[i][j].originalMaterial;
                    }
                }
            }
        }
    }
}
