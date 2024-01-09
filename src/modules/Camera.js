import * as THREE from 'three';

export default class Camera {
    constructor(renderer) {
        const width = renderer.domElement.width;
        const height = renderer.domElement.height;

        this.threeCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);

        this.threeCamera.position.set(3.65, 5, 12);
        this.threeCamera.lookAt(new THREE.Vector3(3.65, 0, 0));

        // this.threeCamera.position.set(10, 5, 3.5);
        // this.threeCamera.lookAt(new THREE.Vector3(5, 0, 3.5));
        this.updateSize(renderer);

        window.addEventListener('resize', () => this.updateSize(renderer), false);
    }

    updateSize(renderer) {
        this.threeCamera.aspect = renderer.domElement.width / renderer.domElement.height;
        this.threeCamera.updateProjectionMatrix();
    }
    setCameraPosition(x, y, z) {
        this.threeCamera.position.set(x, y, z);
        this.threeCamera.lookAt(new THREE.Vector3(x, 0, 0));
    }
    setLookAt(x, y, z) {
        this.threeCamera.lookAt(new THREE.Vector3(x, y, z));
    }
}
