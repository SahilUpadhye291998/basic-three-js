import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';
// const gui = new dat.GUI();
const world = {
    plain: {
        radius: 20,
        tube: 5,
        radialSegments: 25,
        tubularSegments: 100,
    }
}

const raycaster = new THREE.Raycaster();

// Step 1 : to create the seane where all the other element will be placed on
const scene = new THREE.Scene();
/**
 * Step 2 : Create the camera object
 *  parameters: 
 *  first argument: field of view or value in degree
 *  second argument: size of the object in the view
 *  third argument: (near clipping point [will take closness into accound] ) point at which object need to be cliped out or stop showing
 *  forth argument: (far clipping point [will take farness into accound] ) point at which object need to be cliped out or stop showing
 */
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
/**
 * step 3: to get the renderer in the seane
 */
const renderer = new THREE.WebGLRenderer();

// add the dom element of the renderer to the body 
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement)

let stars = [];

function addSphere() {

    // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
    for (var z = -5000; z < 5000; z += 20) {

        // Make a sphere (exactly the same as before). 
        var geometry = new THREE.SphereGeometry(0.5, 32, 32)
        // const rndInt = Math.floor(Math.random() * 3) + 1
        // if (rndInt == 1) {
        //     var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // }
        // else if (rndInt == 2) {
        //     var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // }
        // else {
        //     var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        // }
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        var sphere = new THREE.Mesh(geometry, material)

        // This time we give the sphere random x and y positions between -500 and 500
        sphere.position.x = Math.random() * 1000 - 500;
        sphere.position.y = Math.random() * 1000 - 500;

        // Then set the z position to where it is in the loop (distance of camera)
        sphere.position.z = z;

        // scale it up a bit
        sphere.scale.x = sphere.scale.y = 2;

        //add the sphere to the scene
        scene.add(sphere);

        //finally push it to the stars array 
        stars.push(sphere);
    }
}

function animateStars() {
    // loop through each star
    for (var i = 0; i < stars.length; i++) {
        let star = stars[i];
        // and move it forward dependent on the mouseY position. 
        star.position.z += i / 10;
        // if the particle is too close move it to the back
        if (star.position.z > 1000) star.position.z -= 2000;
    }
}

function render() {
    //get the frame
    requestAnimationFrame(render);

    //render the scene
    renderer.render(scene, camera);
    animateStars();

}

addSphere();
render();