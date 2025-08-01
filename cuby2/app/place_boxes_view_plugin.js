import * as THREE from 'three';
import { app_view_plugin_class } from 'app/app_view_manager.js';
import { shared_view_manager } from 'app/app_view_manager.js';

class MousePointerTracker {
    /**
     *
     */
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

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    isShiftDown = false;
    objects = [];

    rollOverMesh;
    rollOverMaterial;
    cubeGeo;
    cubeMaterial;

    _mousePointerTracker;

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
        this.rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, this.rollOverMaterial);

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
        viewManager.scene.add(this.#_plane);
        viewManager.scene.add(this.rollOverMesh);

        this._mousePointerTracker = new MousePointerTracker(viewManager.scene);
    }

    onPointerMove(event) {

        this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

        this.raycaster.setFromCamera(this.pointer, shared_view_manager.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, false);
        const plane = this.#_plane;
        const intersect = intersects.find(it => it.object === plane);

        if (intersect) {

            // console.log("intersects", intersects);

            // const intersect = intersects[0];



            this._mousePointerTracker.UpdatePoint(intersect.point);

            this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
            const half = new THREE.Vector3(150, 5, 150);
            const one = new THREE.Vector3(300, 10, 300);
            this.rollOverMesh.position.divide(one).floor().multiply(one).add(half);

            // shared_view_manager.render();
        }

    }

    onPointerDown(event) {

        this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

        this.raycaster.setFromCamera(this.pointer, shared_view_manager.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, false);

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

    onDocumentKeyDown(event) {

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
