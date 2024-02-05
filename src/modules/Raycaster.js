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
                if (this.selectedPawn) {
                    this.selectedPawn.material = this.selectedPawn.originalMaterial;
                }
                const selectedMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
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
}
