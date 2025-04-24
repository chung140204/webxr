import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let raycaster, intersected = [];
const tempMatrix = new THREE.Matrix4();
let grabbing = false;
let selectedObject = null;

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 1.6, 3);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add VR button
    document.body.appendChild(VRButton.createButton(renderer));

    // Add some light
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 6, 0);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Add a floor
    const floorGeometry = new THREE.PlaneGeometry(4, 4);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 1.0,
        metalness: 0.0
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Add some objects to interact with
    const geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    for (let i = 0; i < 8; i++) {
        const object = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({
                color: Math.random() * 0xffffff
            })
        );
        object.position.x = Math.random() * 2 - 1;
        object.position.y = Math.random() * 2;
        object.position.z = Math.random() * 2 - 1;
        object.userData.grabbable = true;
        scene.add(object);
    }

    // Controllers
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    scene.add(controller2);

    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    // Tia laser từ controller
    const geometry2 = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
    ]);

    const line = new THREE.Line(geometry2);
    line.name = 'line';
    line.scale.z = 5;

    controller1.add(line.clone());
    controller2.add(line.clone());

    // Raycaster để phát hiện va chạm
    raycaster = new THREE.Raycaster();

    window.addEventListener('resize', onWindowResize, false);
}

function onSelectStart(event) {
    const controller = event.target;
    const intersections = getIntersections(controller);

    if (intersections.length > 0) {
        const intersection = intersections[0];
        const object = intersection.object;
        
        if (object.userData.grabbable) {
            selectedObject = object;
            controller.attach(selectedObject);
            controller.userData.selected = selectedObject;
            grabbing = true;
        }
    }
}

function onSelectEnd(event) {
    const controller = event.target;
    
    if (controller.userData.selected !== undefined) {
        const object = controller.userData.selected;
        object.material.emissive.b = 0;
        scene.attach(object);
        controller.userData.selected = undefined;
        grabbing = false;
        selectedObject = null;
    }
}

function getIntersections(controller) {
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    return raycaster.intersectObjects(scene.children, false);
}

function cleanIntersected() {
    while (intersected.length) {
        const object = intersected.pop();
        if (object) {
            object.material.emissive.r = 0;
        }
    }
}

function intersectObjects(controller) {
    if (controller.userData.selected !== undefined) return;

    const intersections = getIntersections(controller);
    if (intersections.length > 0) {
        const intersection = intersections[0];
        const object = intersection.object;
        
        if (object.userData.grabbable) {
            object.material.emissive.r = 1;
            intersected.push(object);
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    cleanIntersected();
    
    intersectObjects(controller1);
    intersectObjects(controller2);
    
    renderer.render(scene, camera);
} 