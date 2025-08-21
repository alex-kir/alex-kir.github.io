import * as THREE from 'three';
import ScenePluginBase from './ScenePluginBase.js';
import { copyCoordsToPos, cellSize, cellCount } from '../utils.js';

export default class DrawPlaneViewPlugin extends ScenePluginBase {

    #grid;
    #cube;
    #cubeX;
    #cubeY;

    constructor() {
        super();

        // grid
        this.#grid = new THREE.GridHelper(cellSize * cellCount, cellCount, 0xaaaaaa, 0xaaaaaa);

        this.#cube = new THREE.Mesh(
            new THREE.BoxGeometry(200, 5, 200),
            new THREE.MeshBasicMaterial({ color: 0x3f9d7b, transparent: true, opacity: 0.2 }));
        copyCoordsToPos(0, 0, this.#cube.position);

        this.#cubeX = new THREE.Mesh(
            new THREE.BoxGeometry(100, 5, 100),
            new THREE.MeshBasicMaterial({ color: 0x3f9d7b, transparent: true, opacity: 0.2 }));
        copyCoordsToPos(2, 0, this.#cubeX.position);

        this.#cubeY = new THREE.Mesh(
            new THREE.BoxGeometry(100, 5, 100),
            new THREE.MeshBasicMaterial({ color: 0x3f9d7b, transparent: true, opacity: 0.2 }));
        copyCoordsToPos(0, 1, this.#cubeY.position);
    }

    onSceneCreated(viewManager) {
        viewManager.scene.add(this.#grid);
        viewManager.scene.add(this.#cube);
        viewManager.scene.add(this.#cubeX);
        viewManager.scene.add(this.#cubeY);
    }
}
