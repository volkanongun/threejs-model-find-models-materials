import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'

const gui = new dat.GUI()

const donkeyURL = new URL('../assets/Donkey.gltf', import.meta.url);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xA3A3A3)
renderer.shadowMap.enabled = true
renderer.antialias = true

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

const ambientLight = new THREE.AmbientLight(0x999999)
scene.add(ambientLight)

const options = {
    spotlightX: -1.4,
    spotlightY: 9.5,
    spotlightZ: .8,
    spotlightIntensity: 1.2,
    spotlightAngle: .45,
    spotlgihtPenumbra : .3,
    'Main Light' : 0x7C7C7C
}

const spotlight = new THREE.SpotLight(0xFFFFFF)
spotlight.castShadow = true

const spotlightHelper = new THREE.SpotLightHelper(spotlight)
scene.add(spotlightHelper)

spotlight.shadow.mapSize.width = 1024
spotlight.shadow.mapSize.height = 1024
spotlight.shadow.camera.near = 5
spotlight.shadow.camera.far = 10
spotlight.shadow.focus = 1

scene.add(spotlight)
const planeGeometry = new THREE.PlaneGeometry(30,30)
const planeMaterial = new THREE.MeshStandardMaterial({ color : 0xFFFFFF, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -.5 * Math.PI
plane.receiveShadow = true

const assetLoader = new GLTFLoader();

assetLoader.load(donkeyURL.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    
    //console.log(model, model.getObjectByName('BodyMesh'), " MODEL <<<")
    
    model.traverse(function (node) {
        if(node.isMesh)
            node.castShadow = true
    })

    gui.addColor(options, 'Main Light').onChange(function(e){
        model.getObjectByName('BodyMesh').material.color.setHex(e)
    })

    gui.add(options, "spotlightX", -20, 20)
    gui.add(options, "spotlightY", -20, 20)
    gui.add(options, "spotlightZ", -20, 20)
    gui.add(options, "spotlightIntensity", 0, 2)
    gui.add(options, "spotlightAngle", 0, 1)
    gui.add(options, "spotlgihtPenumbra", 0, 1)

    model.scale.set(1,1,1);
    
}, undefined, function(error) {
    console.error(error);
});

function animate() {
    spotlight.position.set(options.spotlightX,options.spotlightY,options.spotlightZ)
    spotlight.intensity = options.spotlightIntensity
    spotlight.angle = options.spotlightAngle
    spotlight.penumbra = options.spotlgihtPenumbra
    spotlightHelper.update()
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});