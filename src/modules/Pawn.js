import { Mesh } from 'three';
import * as THREE from 'three';

const CylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
class Pawn extends Mesh {
    constructor(material, x, z, owner) {
        super(CylinderGeometry, material);
        this.position.set(x, 0.25, z);
        this.isPawn = true;
        this.owner = owner;
    }
}
export default Pawn;
