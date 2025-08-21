import * as THREE from 'three';
import { posToCoords, roundPos, deg } from '../utils.js';

export class CubeCursor {
    #scene;
    #cube;
    #visible = false;
    #model = null;

    get visible() { return this.#visible; }

    constructor() {
        const cubeGeom = new THREE.BoxGeometry(320, 100, 320);
        cubeGeom.translate(0, 50, 0);
        const cubeMat = new THREE.MeshBasicMaterial({ color: 0x9d3f7b, transparent: true, opacity: 0.5 });
        this.#cube = new THREE.Mesh(cubeGeom, cubeMat);

        this.#model = this.#cube;

        // roll-over helpers

        // const rollOverGeo = new THREE.BoxGeometry(300, 10, 300);
        // const rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0x3333ee, opacity: 0.5, transparent: true });
        // this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);

        // cubes

        // const map = new THREE.TextureLoader().load('textures/square-outline-textured.png');
        // map.colorSpace = THREE.SRGBColorSpace;
        // this.cubeGeo = new THREE.BoxGeometry(300, 10, 300);
        // this.cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xfeb74c, map: map });
    }

    setScene(scene) {
        this.#scene = scene;

        if (this.#visible) {
            this.#scene.add(this.#model);
        }
    }

    setDirection(direction) {
        this.#model.rotation.set(0, deg(-direction), 0);
    }

    setModel(model) {
        if (this.#model == model)
            return;

        const saved = this.#model;

        if (this.#visible)
            this.#scene.remove(this.#model);

        this.#model = model ? model : this.#cube;

        if (this.#visible)
            this.#scene.add(this.#model);

        this.#model.position.copy(saved.position);
        this.#model.rotation.copy(saved.rotation);
    }

    showAt(pos) {
        if (!this.#visible) {
            this.#visible = true;
            if (this.#scene)
                this.#scene.add(this.#model);
        }
        roundPos(pos, this.#model.position);
    }

    hide() {
        if (this.#visible) {
            this.#visible = false;
            if (this.#scene)
                this.#scene.remove(this.#model);
        }
    }

    getCoords() {
        return posToCoords(this.#model.position);
    }
}
