import * as THREE from 'three';
import { app_view_plugin_class } from 'app/app_view_plugin.js';

export class draw_plane_view_plugin_class extends app_view_plugin_class {

    #_gridHelper;
    // #_plane;
    // get plane() { return this.#_plane; }

    constructor() {
        super();

        const cellSize = 300;
        const cellCount = 10;

        // plane for raycast
        const geometry = new THREE.PlaneGeometry(cellSize * cellCount, cellSize * cellCount);
        geometry.rotateX(-Math.PI / 2);

        // this.#_plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));

        // grid
        this.#_gridHelper = new THREE.GridHelper(cellSize * cellCount, cellCount);
    }

    onSceneCreated(viewManager) {
        // viewManager.scene.add(this.#_plane);
        viewManager.scene.add(this.#_gridHelper);
    }
}
