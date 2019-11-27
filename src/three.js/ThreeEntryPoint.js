import * as THREE from "three";
// import controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// built out first scene with this guide - https://medium.com/javascript-in-plain-english/javascript-in-3d-an-introduction-to-three-js-780f1e4a2e6d
export default function ThreeEntryPoint(sceneRef) {
    
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x482c34);

    // set where is the camera initially and its zoom
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    // define a rendered. Fill the browser winder with it. 
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Append to renderer.domElement to page. 
    // Normally we use - document.body.appendChild(renderer.domElement); or document.getElementById('threejs').appendChild(renderer.domElement);

    // here we use ref as a mount point of the three.js scene instead of the doc for react
    sceneRef.appendChild(renderer.domElement);

    // add controls - target this domElement
    let controls = new OrbitControls(camera, sceneRef);
    controls.target.set(0, 0, 0);
    controls.rotateSpeed = 0.5;
    controls.update();


    // add the geometry for the the shape of the object
    const geometry =
        new THREE.TorusKnotGeometry(10, 1.3, 500, 6, 6, 20);

    // set material of the shape. phong material balances performance with lighting that makes sense
    const material = new THREE.MeshStandardMaterial({
        color: 0xfcc742,
        // colour object emits from itself (no light source). Can be used to create shadows
        emissive: 0x111111,
        // sets brightness / colour of the surface vs light. Can be 
        specular: 0xffffff,
        // reflectiveness of metal from 0-1
        metalness: 1,
        // 0 = glossy. 1 is rough
        roughness: 0.55,
    });

    // create mesh, add geometry and material, scale it and add to scene
    const mesh = new THREE.Mesh(geometry, material);

    mesh.scale.x = 1;
    mesh.scale.y = 1;
    mesh.scale.z = 1;

    scene.add(mesh);

    // add lighting
    const frontSpot = new THREE.SpotLight(0xeeeece);
    frontSpot.position.set(1000, 1000, 1000);
    const frontSpot2 = new THREE.SpotLight(0xddddce);
    frontSpot2.position.set(-500, -500, -500);

    // add lighting to the mesh
    scene.add(frontSpot2);
    scene.add(frontSpot);

    // set camera position
    let animate = function () {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
        mesh.rotation.z += 0.005;
        renderer.render(scene, camera);
    };
    // execute
    animate();

    sceneRef.appendChild(renderer.domElement);
}