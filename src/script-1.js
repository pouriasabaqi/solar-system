import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
/* import { Pane } from "tweakpane";
const pane = new Pane(); */

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1)
const planeGeometry = new THREE.PlaneGeometry(1, 1)

// initialize material
const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color('lightgreen')
material.transparent = true
material.opacity = 0.5
material.side = THREE.DoubleSide;
material.fog = true;


const fog = new THREE.Fog('black',1 ,10)
scene.fog = fog
const mesh = new THREE.Mesh(geometry, material)

const mesh2 = new THREE.Mesh(geometry, material)
mesh2.position.x = 1.5;

const plane = new THREE.Mesh(planeGeometry, material);
plane.position.x = -1.5;

const axesHelper = new THREE.AxesHelper(2);
// mesh.add(axesHelper);
scene.add(mesh);
scene.add(mesh2);
scene.add(plane);

/* pane.addBinding(mesh.scale, 'y', {
  min: 0,
  max: 10,
  step: 0.1,
  label:'Scale Y',
})
pane.addBinding(mesh.scale, 'x', {
  min: 0,
  max: 10,
  step: 0.1,
  label:'Scale X',
})
 */

// initialize camera 
const camera = new THREE.PerspectiveCamera(75,
  window.innerWidth / window.innerHeight,
  0.1,
  30)

/* const aspectRation = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  -1 * aspectRation,
  1 * aspectRation,
  1,
  -1,
  0.1,
  200
) */

// position the camera
camera.position.z = 5

// initialize render 
const canvas = document.querySelector('canvas.threejs')
const renderer = new THREE.WebGL1Renderer({
  canvas,
  antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// initialize the controls 
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;

// control camera and size changes 
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
})

// regardless of user frame we have same experience
const clock = new THREE.Clock();
let previousTime = 0;
const renderLoop = () => {
  const currentTime = clock.getElapsedTime();
  const delta = currentTime - previousTime;
  // mesh.rotation.y += (THREE.MathUtils.degToRad(1) * delta) * 20
  previousTime = currentTime;

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(renderLoop);
}
renderLoop();


