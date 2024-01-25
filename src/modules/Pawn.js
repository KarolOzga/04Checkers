import { Mesh } from 'three';
import * as THREE from 'three';

const CylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
class Pawn extends Mesh {
    constructor(material, x, z) {
        super(CylinderGeometry, material);
        this.position.set(x, 0.25, z);
    }
}

export default Pawn;
