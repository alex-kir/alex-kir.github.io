import * as THREE from 'three';
import { app_view_plugin_class } from 'app/app_view_plugin.js';
import { shared_view_manager } from 'app/app_view_manager.js';
import { shared_resource_manager } from 'app/app_resource_manager.js';

class MousePointerTracker {

    #_sphere;
    #_scene;

    constructor(scene) {
        // super();
        const sphereGeometry = new THREE.SphereGeometry(4, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.#_sphere = sphere;
        this.#_scene = scene;
        scene.add(sphere);
    }

    UpdatePoint(point) {
        this.#_sphere.position.copy(point);
    }
};

export class place_boxes_view_plugin_class extends app_view_plugin_class {

    #_plane;
    #viewManager;

    #raycaster = new THREE.Raycaster();
    #pointer = new THREE.Vector2();

    #currentCandidate;

    isShiftDown = false;
    objects = [];

    rollOverMesh;
    cubeGeo;
    cubeMaterial;

    _mousePointerTracker;

    #models = [];
    #activeModel;

    constructor() {
        super();

        // plane for raycast
        const cellSize = 300;
        const cellCount = 10;

        const geometry = new THREE.PlaneGeometry(cellSize * cellCount, cellSize * cellCount);
        geometry.rotateX(-Math.PI / 2);

        this.#_plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        this.objects.push(this.#_plane);

        // roll-over helpers

        const rollOverGeo = new THREE.BoxGeometry(300, 10, 300);
        const rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0x3333ee, opacity: 0.5, transparent: true });
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);

        // cubes

        const map = new THREE.TextureLoader().load('textures/square-outline-textured.png');
        map.colorSpace = THREE.SRGBColorSpace;
        this.cubeGeo = new THREE.BoxGeometry(300, 10, 300);
        this.cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xfeb74c, map: map });

        // events


        document.addEventListener('pointermove', this.onPointerMove.bind(this));
        document.addEventListener('pointerdown', this.onPointerDown.bind(this));
        document.addEventListener('keydown', this.onDocumentKeyDown.bind(this));
        document.addEventListener('keyup', this.onDocumentKeyUp.bind(this));
    }

    onSceneCreated(viewManager) {
        this.#viewManager = viewManager;

        viewManager.scene.add(this.#_plane);
        //viewManager.scene.add(this.rollOverMesh);

        this._mousePointerTracker = new MousePointerTracker(viewManager.scene);

        this.#models.push([shared_resource_manager.get_object('a/home_6x3'), shared_resource_manager.get_object('b/home_6x3')]);
        this.#models.push([shared_resource_manager.get_object('a/home_3x3_lo'), shared_resource_manager.get_object('b/home_3x3_lo')]);
        this.#models.push([shared_resource_manager.get_object('a/home_3x3_hi'), shared_resource_manager.get_object('b/home_3x3_hi')]);
        this.#models.push([shared_resource_manager.get_object('a/garage_6x3'), shared_resource_manager.get_object('b/garage_6x3')]);
        this.#models.push([shared_resource_manager.get_object('a/veranda_3x3_lo'), shared_resource_manager.get_object('b/veranda_3x3_lo')]);
        this.#models.push([shared_resource_manager.get_object('a/veranda_3x3_hi'), shared_resource_manager.get_object('b/veranda_3x3_hi')]);
        this.#setActiveModel(0);
    }

    #updateRaycaster(event) {
        const container = this.#viewManager.container;
        if (!container)
            return false;

        this.#pointer.set(((
            event.clientX - container.offsetLeft) / container.offsetWidth) * 2 - 1,
            1 - ((event.clientY - container.offsetTop) / container.offsetHeight) * 2);

        this.#raycaster.setFromCamera(this.#pointer, shared_view_manager.camera);

        return true;
    }

    onPointerMove(event) {

        if (!this.#viewManager)
            return;

        if (!this.#updateRaycaster(event))
            return;

        const intersects = this.#raycaster.intersectObjects(this.objects, true);

        if (intersects.length === 0) {
            this.#resetCandidate();
            return;
        }

        // console.log(intersects);

        const intersect = intersects[0];

        this._mousePointerTracker.UpdatePoint(intersect.point);

        if (!this.#currentCandidate) {
            this.#currentCandidate = this.#activeModel.clone();
            this.#viewManager.scene.add(this.#currentCandidate);
        }
        const candidate = this.#currentCandidate;


        let x = intersect.point.x + intersect.face.normal.x * 50;
        let z = intersect.point.z + intersect.face.normal.z * 50;
        x = Math.floor(x / 300) * 300;
        z = Math.floor(z / 300) * 300;
        candidate.position.set(x, 0, z);

        // candidate.position.copy(intersect.point).add(intersect.face.normal);
        // const half = new THREE.Vector3(150, 5, 150);
        // const one = new THREE.Vector3(300, 10, 300);
        // candidate.position.divide(one).floor().multiply(one);//.add(half);



        /*
                const plane = this.#_plane;
                const intersect = intersects.find(it => it.object === plane);
        
                if (intersect) {
        
                    
        
                    this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
                    const half = new THREE.Vector3(150, 5, 150);
                    const one = new THREE.Vector3(300, 10, 300);
                    this.rollOverMesh.position.divide(one).floor().multiply(one).add(half);
        
        
        
                    // shared_view_manager.render();
                }
        */
    }

    onPointerDown(event) {
        console.log(event);

        if (event.buttons !== 1)
            return;

        const candidate = this.#currentCandidate;
        this.#currentCandidate = null;

        if (!candidate)
            return;

        // this.objects.push(candidate);
        // console.log(this.objects);

        // {
        //     this.#currentCandidate = this.#models[0].clone();
        //     this.#viewManager.scene.add(this.#currentCandidate);
        // }

        return;
        if (!this.#updateRaycaster(event))
            return;

        const intersects = this.#raycaster.intersectObjects(this.objects, false);

        if (intersects.length > 0) {

            const intersect = intersects[0];

            // delete cube

            // if (isShiftDown) {

            //     if (intersect.object !== plug1.plane) {

            //         shared_view_manager.scene.remove(intersect.object);

            //         objects.splice(objects.indexOf(intersect.object), 1);
            //     }

            //     // create cube

            // } else {

            if (intersect.object !== this.#_plane) {
                shared_view_manager.scene.remove(intersect.object);
                this.objects.splice(this.objects.indexOf(intersect.object), 1);
            }
            else {


                const voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);
                voxel.position.copy(intersect.point).add(intersect.face.normal);
                const half = new THREE.Vector3(150, 5, 150);
                const one = new THREE.Vector3(300, 10, 300);
                voxel.position.divide(one).floor().multiply(one).add(half);

                shared_view_manager.scene.add(voxel);
                this.objects.push(voxel);
            }

            // }

            // shared_view_manager.render();

        }

    }

    #setActiveModel(index) {
        let model = this.#models[index][0];
        console.log("index:", index);
        console.log(model);
        console.log(this.#activeModel);
        if (this.#activeModel == model)
        {
            model = this.#models[index][1];
        }
        this.#activeModel = model;
        this.#resetCandidate();
    }

    #resetCandidate() {
        if (this.#currentCandidate) {
            this.#viewManager.scene.remove(this.#currentCandidate);
            this.#currentCandidate = null;
        }
    }

    onDocumentKeyDown(event) {
        console.log(event);
        switch (event.key) {
            case '1':
                this.#setActiveModel(0);
                break;
            case '2':
                this.#setActiveModel(1);
                break;
            case '3':
                this.#setActiveModel(2);
                break;
            case '4':
                this.#setActiveModel(3);
                break;
            case '5':
                this.#setActiveModel(4);
                break;
            case '6':
                this.#setActiveModel(5);
                break;
        }
        switch (event.keyCode) {
            case 16: isShiftDown = true; break;
        }
    }

    onDocumentKeyUp(event) {
        switch (event.keyCode) {
            case 16: isShiftDown = false; break;
        }
    }
}
