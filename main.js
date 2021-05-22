import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';

const gui = new dat.GUI();
const world = {
    plain: {
        width: 300,
        height: 300,
        widthSegments: 150,
        heightSegments: 250,
    }
}
gui.add(world.plain, 'width', 1, 500).onChange(generatePlane)
gui.add(world.plain, 'height', 1, 500).onChange(generatePlane)
gui.add(world.plain, 'widthSegments', 1, 500).onChange(generatePlane)
gui.add(world.plain, 'heightSegments', 1, 500).onChange(generatePlane)


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
const camera = new THREE.PerspectiveCamera(90, innerWidth / innerHeight, 0.1, 1000)
/**
 * step 3: to get the renderer in the seane
 */
const renderer = new THREE.WebGLRenderer();

// add the dom element of the renderer to the body 
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement)

const planeGeometry = new THREE.PlaneGeometry(world.plain.width, world.plain.height, world.plain.widthSegments, world.plain.heightSegments);
const materialPlaneGeometry = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, flatShading: THREE.FlatShading, vertexColors: true })
const planeMesh = new THREE.Mesh(planeGeometry, materialPlaneGeometry);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

scene.add(planeMesh);

generatePlane();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);


const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

new OrbitControls(camera, renderer.domElement)

// camera.position.z = 25;
// camera.position = new THREE.Vector3(0.17, -24.67, 8.027);
camera.position.z = 7;

/**
 * IMP Search Here
 */

function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(world.plain.width, world.plain.height, world.plain.widthSegments, world.plain.heightSegments);
    const { array } = planeMesh.geometry.attributes.position;
    const randomValues = [];

    for (let index = 0; index < array.length; index++) {
        if (index % 3 === 0) {
            const x = array[index];
            const y = array[index + 1];
            const z = array[index + 2];
            array[index] = x + (Math.random() - 0.5);
            array[index + 1] = y + (Math.random() - 0.5);
            array[index + 2] = z + Math.random();
        }
        randomValues.push(Math.random());
    }
    const color = [];
    for (let index = 0; index < planeMesh.geometry.attributes.position.count; index++) {
        color.push(0, 0.19, 0.4)
    }
    planeMesh.geometry.attributes.position.randomValues = randomValues;
    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;
    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(color), 3))

}

let frame = 0;
function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    frame += 0.01;
    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position;

    for (let index = 0; index < array.length; index += 3) {
        array[index] = originalPosition[index] + Math.cos(frame + randomValues[index]) * 0.01;
    }
    planeMesh.geometry.attributes.position.needsUpdate = true;
    const intersets = raycaster.intersectObject(planeMesh);
    if (intersets.length > 0) {
        const { color } = intersets[0].object.geometry.attributes;
        color.setX(intersets[0].face.a, 0.1);
        color.setY(intersets[0].face.a, 0.5);
        color.setZ(intersets[0].face.a, 1);

        color.setX(intersets[0].face.b, 0.1);
        color.setY(intersets[0].face.b, 0.5);
        color.setZ(intersets[0].face.b, 1);

        color.setX(intersets[0].face.c, 0.1);
        color.setY(intersets[0].face.c, 0.5);
        color.setZ(intersets[0].face.c, 1);
        // intersets[0].object.geometry.attributes.color.setX(intersets[0].face.a, 0);
        intersets[0].object.geometry.attributes.color.needsUpdate = true;

        const initialColor = {
            r: 0,
            g: 0.19,
            b: 0.4
        }

        const hoveredColor = {
            r: 0.1,
            g: 0.5,
            b: 1
        }

        gsap.to(hoveredColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            onUpdate: () => {
                color.setX(intersets[0].face.a, hoveredColor.r);
                color.setY(intersets[0].face.a, hoveredColor.g);
                color.setZ(intersets[0].face.a, hoveredColor.b);

                color.setX(intersets[0].face.b, hoveredColor.r);
                color.setY(intersets[0].face.b, hoveredColor.g);
                color.setZ(intersets[0].face.b, hoveredColor.b);

                color.setX(intersets[0].face.c, hoveredColor.r);
                color.setY(intersets[0].face.c, hoveredColor.g);
                color.setZ(intersets[0].face.c, hoveredColor.b);
                color.needsUpdate = true;
            }
        })
    }
}

const mouse = {
    x: undefined,
    y: undefined,
}
addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
})


document.getElementById("btnTransition").onclick = transition;
async function transition() {
    camera.rotation.x = 0.1;
    aSampleFunction();

}

async function aSampleFunction() {
    if (camera.rotation.x >= 2.5) {
        scene.remove(planeMesh);
        cancelAnimationFrame(aSampleFunction)
        console.log("OK we will get to next part of the page")
        window.location.href = "http://localhost:3000/partical.html";

    } else {
        console.log(camera.rotation.x);
        requestAnimationFrame(aSampleFunction);
        renderer.render(scene, camera);
        camera.rotation.x += 0.02;
    }
}

animate();