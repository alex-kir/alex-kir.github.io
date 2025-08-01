
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { app_view_plugin_class } from 'app/app_view_manager.js';
import { deg } from 'app/utils.js';

export class camera_control_view_plugin_class extends app_view_plugin_class {
    #_controls;
    constructor() {
        super();

    }

    onSceneCreated(viewManager) {
        //this.#_control.dispose();

        const controls = new OrbitControls(viewManager.camera, viewManager.renderer.domElement);

        controls.minDistance = 500;
        controls.maxDistance = 5000;

        controls.maxPolarAngle = deg(90);

        // controls.listenToKeyEvents( window ); // optional

        // mouseButtons = {
        // 	LEFT: THREE.MOUSE.ROTATE,
        // 	MIDDLE: THREE.MOUSE.DOLLY,
        // 	RIGHT: THREE.MOUSE.PAN
        // }

        controls.mouseButtons = { RIGHT: THREE.MOUSE.ROTATE };

        controls.update();

        this.#_controls = controls;

        // viewManager.scene.add(this.#_plane);
        // viewManager.scene.add(this.#_gridHelper);
    }
}
