import * as THREE from "three";
import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import { Scene } from "three";

const container = document.getElementById("root");
const scene = new Scene();
const renderer = new Renderer(scene, container);
const camera = new Camera(renderer.threeRenderer);
// const ico = new Ico(scene)
// const plain = new Plain(scene);

const GameObject = {
  render() {
    renderer.render(scene, camera.threeCamera);
    // ico.update()

    requestAnimationFrame(GameObject.render);
  },
};

let board = [];

export { GameObject };
