
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ScenePluginBase from './ScenePluginBase.js';
import { deg } from '../utils.js';

class CameraControlScenePlugin extends ScenePluginBase {
    #_controls;
    constructor() {
        super();

    }

    onSceneCreated(viewManager) {
        //this.#_control.dispose();

        const controls = new OrbitControls(viewManager.camera, viewManager.renderer.domElement);

        controls.minDistance = 500;
        controls.maxDistance = 5000;

        controls.minPolarAngle = deg(0);
        controls.maxPolarAngle = deg(90);

        controls.target.set(0, 175, 0);

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

ScenePluginBase.registerPlugin(CameraControlScenePlugin);