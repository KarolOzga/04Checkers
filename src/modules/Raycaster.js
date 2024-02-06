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
                this.clearGreenFields();
                if (this.selectedPawn) {
                    this.selectedPawn.material = this.selectedPawn.originalMaterial;
                }
                const selectedMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

                console.log(allNetFunctions.fields2D, 'FIELDS');
                console.log(intersectedObject.position, 'POSITION OF SELECTED PAWN');

                let acceptableField = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

                if (
                    intersectedObject.position.x + 1 < allNetFunctions.fields2D.length &&
                    intersectedObject.position.z - 1 >= 0 &&
                    allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z - 1].isFree
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
                    allNetFunctions.fields2D[intersectedObject.position.x + 1][intersectedObject.position.z + 1].isFree
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
                    allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z - 1].isFree
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
                    allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].isFree
                ) {
                    if (!allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].originalMaterial) {
                        allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].originalMaterial =
                            allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].material;
                    }
                    allNetFunctions.fields2D[intersectedObject.position.x - 1][intersectedObject.position.z + 1].material = acceptableField;
                }

                intersectedObject.originalMaterial = intersectedObject.material;
                intersectedObject.material = selectedMaterial;
                this.selectedPawn = intersectedObject;
            } else if (intersectedObject.isField && intersectedObject.isBlack && this.selectedPawn && intersectedObject.isFree) {
                this.movePawn(intersectedObject);
            } else if (!intersectedObject.isFree) {
                console.log('Invalid move. Field is already occupied');
            }
        }
    }

    movePawn(intersectedObject) {
        const dx = Math.abs(this.selectedPawn.position.x - intersectedObject.position.x);
        const dz = Math.abs(this.selectedPawn.position.z - intersectedObject.position.z);

        allNetFunctions.fields2D[this.selectedPawn.position.x][this.selectedPawn.position.z].isFree = true;

        if (dx <= 1 && dz <= 1) {
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

                        this.clearGreenFields();

                        const pawnId = this.selectedPawn.pawnId;
                        const newPosition = { ...this.selectedPawn.position };

                        allNetFunctions.fields2D[this.selectedPawn.position.x][this.selectedPawn.position.z].isFree = false;

                        this.selectedPawn = null;
                        client.emit('pawnMoved', { pawnId, newPosition });
                        allNetFunctions.setPlayerMove(pawnId);
                        allNetFunctions.getPlayerMove();
                    })
                )
                .start();
        } else {
            console.log('Invalid move. Pawns can only move one field at a time.');
        }
    }

    clearGreenFields() {
        for (let i = 0; i < allNetFunctions.fields2D.length; i++) {
            for (let j = 0; j < allNetFunctions.fields2D[i].length; j++) {
                let color = allNetFunctions.fields2D[i][j].material.color;
                if (color.r === 0 && color.g === 1 && color.b === 0) {
                    allNetFunctions.fields2D[i][j].material = allNetFunctions.fields2D[i][j].originalMaterial;
                }
            }
        }
    }
}
