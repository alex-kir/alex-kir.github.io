import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { deg, Signal } from './utils.js';

export default class AppResourceManager {
    #_fbxLoader;
    #_cache;
    #_inProgress;

    requestRender = new Signal();

    constructor() {
        this.#_fbxLoader = new FBXLoader();
        this.#_cache = new Map();
        this.#_inProgress = new Map();
    }

    getObject(name) {

        if (name == 'column')
            return this.#createColumn();

        if (name == 'grass')
            return this.#createGrass();

        const result = new THREE.Group();
        const cache = this.#_cache;
        if (cache.has(name)) {
            result.add(cache.get(name).clone());
        }
        else {
            const inProgress = this.#_inProgress;
            if (inProgress.has(name)) {
                const list = inProgress.get(name);
                list.push(result);
            }
            else {
                const list = [];
                list.push(result);
                inProgress.set(name, list);
                // const self = this;
                this.#_fbxLoader.load('models/' + name + '.fbx', (obj) => {

                    obj.scale.set(0.1, 0.1, 0.1);

                    if (name.startsWith('a/')) {
                        //obj.rotation.set(0, deg(-90), 0);
                        obj.rotation.set(0, deg(0), 0);
                        obj.position.set(-150, 0, 150);
                    }

                    cache.set(name, obj);
                    list.forEach(element => {
                        element.add(obj.clone());
                    });

                    if (list.length) {
                        this.requestRender.notify();
                    }

                    list.length = 0;
                });
            }
        }

        return result;
    }



    #columnGeometry;
    #columnMaterial;
    #createColumn() {
        if (!this.#columnGeometry) {
            this.#columnGeometry = new THREE.BoxGeometry(10, 600, 10);
            this.#columnGeometry.translate(0, 300, 0);
        }

        if (!this.#columnMaterial) {
            this.#columnMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        }

        return new THREE.Mesh(this.#columnGeometry, this.#columnMaterial);
    }

    // https://drive.google.com/drive/folders/12ZRuLfjAMWIiTmJU_yg-oPVL9N4elvMT
    #grassGeometry;
    #grassMaterial;
    #createGrass() {
        if (!this.#grassGeometry) {
            this.#grassGeometry = new THREE.BoxGeometry(300, 10, 300);
            this.#grassGeometry.translate(0, -6, 0);
        }

        if (!this.#grassMaterial) {
            const texture = new THREE.TextureLoader().load("textures/Grass_001_SD/Grass_001_COLOR.jpg");
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(0.1, 0.1);

            const normal = new THREE.TextureLoader().load("textures/Grass_001_SD/Grass_001_NORM.jpg");
            normal.wrapS = THREE.RepeatWrapping;
            normal.wrapT = THREE.RepeatWrapping;
            normal.repeat.set(0.1, 0.1);

            this.#grassMaterial = new THREE.MeshPhongMaterial({
                // color: 0x339933,
                map: texture,
                //noramlMap: normal,
                // map: normal,
            });
            this.#grassMaterial.normalMap = normal;
            this.#grassMaterial.normalScale.set(1, 1);
        }

        return new THREE.Mesh(this.#grassGeometry, this.#grassMaterial);
    }
}
