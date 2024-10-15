import { MutableRefObject } from "react";
import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const animations: CallableFunction[] = [];

function animate() {
  animations.forEach((animation) => animation());
  renderer.render(scene, camera);
}

export function initScene(element: MutableRefObject<HTMLDivElement>) {
  if (!WebGL.isWebGL2Available()) {
    const warning = WebGL.getWebGL2ErrorMessage();
    element.current.appendChild(warning);
    return undefined;
  }

  scene.clear();
  // camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerHeight, window.innerHeight);
  element.current.appendChild(renderer.domElement);

  setCameraPos(new THREE.Vector3(0, 0, 30));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 10;
  controls.maxDistance = 500;
  addAnimation(() => {
    controls.update();
  });

  renderer.setAnimationLoop(animate);

  return renderer.domElement;
}

export function addAnimation(animation: CallableFunction) {
  animations.push(animation);
}

export function setCameraPos(pos: THREE.Vector3) {
  camera.applyMatrix4(new THREE.Matrix4().makeTranslation(pos));
}

export function addToScene(object: THREE.Object3D) {
  scene.add(object);
}

export function addCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);

  return cube;
}

export function add3DCurve() {
  //Create a closed wavey loop
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-10, 0, 10),
    new THREE.Vector3(-5, 5, 5),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(5, -5, 5),
    new THREE.Vector3(10, 0, 10),
  ]);

  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const curveObject = new THREE.Line(geometry, material);

  return curveObject;
}
