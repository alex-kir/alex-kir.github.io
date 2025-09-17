import * as THREE from 'three';
import ScenePluginBase from './ScenePluginBase.js';
import { copyCoordsToPos, cellSize, cellCount } from '../utils.js';

class DrawPlaneScenePlugin extends ScenePluginBase {

    #grid;
    #cube;
    #cubeX;
    #cubeY;

    constructor() {
        super();

        // grid
        this.#grid = new THREE.GridHelper(cellSize * cellCount, cellCount, 0xaaffaa, 0xaaffaa);

        // this.#cube = new THREE.Mesh(
        //     new THREE.BoxGeometry(200, 5, 200),
        //     new THREE.MeshBasicMaterial({ color: 0x3f9d7b, transparent: true, opacity: 0.2 }));
        // copyCoordsToPos(0, 0, this.#cube.position);

        // this.#cubeX = new THREE.Mesh(
        //     new THREE.BoxGeometry(100, 5, 100),
        //     new THREE.MeshBasicMaterial({ color: 0x3f9d7b, transparent: true, opacity: 0.2 }));
        // copyCoordsToPos(2, 0, this.#cubeX.position);

        // this.#cubeY = new THREE.Mesh(
        //     new THREE.BoxGeometry(100, 5, 100),
        //     new THREE.MeshBasicMaterial({ color: 0x3f9d7b, transparent: true, opacity: 0.2 }));
        // copyCoordsToPos(0, 1, this.#cubeY.position);

    }

    onSceneCreated(viewManager) {
        super.onSceneCreated(viewManager);

        viewManager.scene.add(this.#grid);
        // viewManager.scene.add(this.#cube);
        // viewManager.scene.add(this.#cubeX);
        // viewManager.scene.add(this.#cubeY);

        
        for (let cellX = -10; cellX < 10; cellX++) {
            for (let cellY = -10; cellY < 10; cellY++) {
                const sceneObj = this.resourceManager.getObject('grass');
                this.scene.add(sceneObj);
                copyCoordsToPos(cellX, cellY, sceneObj.position);
            }
        }
    }
}

ScenePluginBase.registerPlugin(DrawPlaneScenePlugin);
