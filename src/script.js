import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { Pane } from "tweakpane";
const pane = new Pane();

const scene = new THREE.Scene();

const sphereGeometry = new THREE.SphereGeometry(
  1,
  32,
  32
);

// add textureLoader ;
const textureLoader = new THREE.TextureLoader();

// adding textures
const sunTexture = textureLoader.load(
  "/textures/solar/8k_sun.jpg"
);
const mercuryTexture = textureLoader.load(
  "/textures/solar/8k_mercury.jpg"
);
const venuesTexture = textureLoader.load(
  "/textures/solar/8k_venus_surface.jpg"
);
const earthTexture = textureLoader.load(
  "/textures/solar/8k_earth_daymap.jpg"
);
const marsTexture = textureLoader.load(
  "/textures/solar/8k_mars.jpg"
);
const moonTexture = textureLoader.load(
  "/textures/solar/8k_moon.jpg"
);
const backgroundTexture = textureLoader.load(
  "/textures/solar/8k_stars_milky_way.jpg"
);

// add material
const mercuryMaterial =
  new THREE.MeshStandardMaterial({
    map: mercuryTexture,
  });
const venusMaterial =
  new THREE.MeshStandardMaterial({
    map: venuesTexture,
  });
const earthMaterial =
  new THREE.MeshStandardMaterial({
    map: earthTexture,
  });
const marsMaterial =
  new THREE.MeshStandardMaterial({
    map: marsTexture,
  });
const moonMaterial =
  new THREE.MeshStandardMaterial({
    map: moonTexture,
  });

scene.background =
  new THREE.CubeTextureLoader().setPath(
    "/textures/solar/cube_map/"
  ).load([
    'nx.png',
    'ny.png',
    'nz.png',
    'px.png',
    'py.png',
    'pz.png',
  ]);

// init Sun
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(
  sphereGeometry,
  sunMaterial
);
sun.scale.setScalar(5);
scene.add(sun);

// Create Planet factory
const createPlanet = (planet) => {
  // create mesh
  const planetMesh = new THREE.Mesh(
    sphereGeometry,
    planet.material
  );

  // set scale
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;

  return planetMesh;
};

// Create Moon factory
const createMoon = (moon) => {
  const moonMesh = new THREE.Mesh(
    sphereGeometry,
    moonMaterial
  );
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;

  return moonMesh;
};

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.01,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.03,
        color: 0xffffff,
      },
    ],
  },
];

const planetMeshes = planets.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);

  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon);
    planetMesh.add(moonMesh);
  });

  return planetMesh;
});

// init lighting
const light = new THREE.AmbientLight("", 0.05);
scene.add(light);

const pointLight = new THREE.PointLight(
  "white",
  300
);
const pointLightHelper =
  new THREE.PointLightHelper(pointLight);
scene.add(pointLight, pointLightHelper);

// init camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);

// position the camera
camera.position.z = 40;

pane.addBinding(camera, "position", {
  min: 0,
  step: 0.1,
});

// init render
const canvas = document.querySelector(
  "canvas.threejs"
);
const renderer = new THREE.WebGL1Renderer({
  canvas,
  antialias: true,
});
renderer.setSize(
  window.innerWidth,
  window.innerHeight
);
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

// init the controls
const controls = new OrbitControls(
  camera,
  canvas
);
controls.enableDamping = true;

// control camera and size changes
window.addEventListener("resize", () => {
  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
  camera.aspect =
    window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// regardless of user frame we have same experience
const clock = new THREE.Clock();
let previousTime = 0;
const renderLoop = () => {
  const elapsedTime = clock.getElapsedTime();

  planetMeshes.forEach((planet, indexPlanet) => {
    planet.rotation.y +=
      planets[indexPlanet].speed;
    planet.position.x =
      Math.sin(planet.rotation.y) *
      planets[indexPlanet].distance;
    planet.position.z =
      Math.cos(planet.rotation.y) *
      planets[indexPlanet].distance;
    planet.children.forEach((moon, indexMoon) => {
      moon.rotation.y +=
        planets[indexPlanet].moons[
          indexMoon
        ].speed;
      moon.position.x =
        Math.sin(moon.rotation.y) *
        planets[indexPlanet].moons[indexMoon]
          .distance;
      moon.position.z =
        Math.cos(moon.rotation.y) *
        planets[indexPlanet].moons[indexMoon]
          .distance;
    });
  });

  sun.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();
