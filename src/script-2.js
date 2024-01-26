import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { Pane } from "tweakpane";
const pane = new Pane();

const scene = new THREE.Scene();

// initialize loader 
const textureLoader = new THREE.TextureLoader();




const geometry = new THREE.BoxGeometry(1, 1, 1)
const uv2 = new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
geometry.setAttribute('uv2', uv2)

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 10)
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)

// initialize texture 
const spaceAlbedo = textureLoader.load('/textures/space-cruiser-panels2-bl/space-cruiser-panels2_albedo.png');
const spaceAo = textureLoader.load('/textures/space-cruiser-panels2-bl/space-cruiser-panels2_ao.png');
const spaceHeight = textureLoader.load('/textures/space-cruiser-panels2-bl/space-cruiser-panels2_height.png');
const spaceMetallic = textureLoader.load('/textures/space-cruiser-panels2-bl/space-cruiser-panels2_metallic.png');
const spaceNormal = textureLoader.load('/textures/space-cruiser-panels2-bl/space-cruiser-panels2_normal-ogl.png');
const spaceRoughness = textureLoader.load('/textures/space-cruiser-panels2-bl/space-cruiser-panels2_roughness.png');

/* spaceAlbedo.wrapS = THREE.RepeatWrapping
spaceAlbedo.wrapT = THREE.RepeatWrapping */

/* spaceAlbedo.offset.x = 0.5;
spaceAlbedo.offset.y = 0.5; */

// initialize material
const material = new THREE.MeshPhysicalMaterial()
material.map = spaceAlbedo;

material.aoMap = spaceAo;
material.aoMapIntensity = 0.2;

material.normalMap = spaceNormal

material.roughnessMap = spaceRoughness;
// material.roughness = 0.1

material.metalnessMap = spaceMetallic
material.metalness = .8

/* material.displacementMap = spaceHeight
material.displacementScale = 0.1 */

// initialize group 
const group = new THREE.Group();

pane.addBinding(material, 'metalness', {
  min: 0,
  max: 1,
  step: 0.1,
  label: 'metalness',
})
pane.addBinding(material, 'roughness', {
  min: 0,
  max: 1,
  step: 0.1,
  label: 'roughness',
})
// with highest value of metalness we don't have any more reflectivity.
pane.addBinding(material, 'reflectivity', {
  min: 0,
  max: 1,
  step: 0.1,
  label: 'reflectivity',
})
// it's like wax
pane.addBinding(material, 'clearcoat', {
  min: 0,
  max: 1,
  step: 0.1,
  label: 'clearcoat',
})

pane.addBinding(material, 'aoMapIntensity', {
  min: 0,
  max: 1,
  step: 0.01,
  label: 'Ao Intensity',
})

const mesh = new THREE.Mesh(geometry, material)
const mesh2 = new THREE.Mesh(torusKnotGeometry, material)
mesh2.position.x = 1.5;
const plane = new THREE.Mesh(planeGeometry, material);

plane.position.y = -3;
plane.rotation.x = -(Math.PI * 0.5);
plane.scale.set(10, 10)

const sphere = new THREE.Mesh()
sphere.geometry = sphereGeometry;
sphere.material = material;
sphere.position.y = 1.5;

const cylinder = new THREE.Mesh()
cylinder.geometry = cylinderGeometry;
cylinder.material = material;
cylinder.position.x = -1.5;

scene.add(mesh);
scene.add(mesh2);
scene.add(plane);
scene.add(sphere);
group.add(mesh, mesh2, plane, sphere, cylinder)
scene.add(group);

// initialize lighting 
const light = new THREE.AmbientLight('0xffffff', 0.5)
scene.add(light);

/* const pointLight = new THREE.PointLight('0xffffff', 200, 10)
pointLight.position.set(7 , 2, 3)
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLight)
scene.add(pointLightHelper ) */

/* const spotLight = new THREE.SpotLight(0x59ffe9,20)
spotLight.position.set(2,2,2)
const spotLightHelper= new THREE.SpotLightHelper(spotLight, 'white');
scene.add(spotLight)
scene.add(spotLightHelper) */

const rectLight = new THREE.RectAreaLight(0x59ffe9, 10, 10, 2)
rectLight.position.y = 3;
rectLight.lookAt(0, 0, 0)
const rectLightHelper = new RectAreaLightHelper(rectLight)
scene.add(rectLight, rectLightHelper)

// initialize camera 
const camera = new THREE.PerspectiveCamera(75,
  window.innerWidth / window.innerHeight,
  0.1,
  50)

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
  // rectLight.rotation.y += Math.sin(0.1 * delta)
  /*   group.children.forEach((child) => {
      if (child instanceof THREE.Mesh)
        child.rotation.y += 0.1 * delta;
    }) */

  previousTime = currentTime;

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(renderLoop);
}
renderLoop();


