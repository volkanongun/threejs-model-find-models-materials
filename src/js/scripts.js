import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'

const gui = new dat.GUI()
const options = {
    'Main Light' : 0x7C7C7C
}

const donkeyURL = new URL('../assets/Donkey.gltf', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(7, 4, 7);
orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const ambientLight = new THREE.AmbientLight(0xededed, .8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
scene.add(directionalLight)
directionalLight.position.set(10,11,7)

const assetLoader = new GLTFLoader();

let mixer, action
assetLoader.load(donkeyURL.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    
    console.log(model, model.getObjectByName('BodyMesh'), " MODEL <<<")

    gui.addColor(options, 'Main Light').onChange(function(e){
        model.getObjectByName('BodyMesh').material.color.setHex(e)
    })
    
}, undefined, function(error) {
    console.error(error);
});

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});