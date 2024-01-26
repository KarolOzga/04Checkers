import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

class Field extends Mesh {
    constructor(x, y, z) {
        const geometry = new BoxGeometry(1, 0.5, 1);
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        super(geometry, material);
        this.position.set(x, y, z);
        this.isField = true;
    }
}

export default Field;
