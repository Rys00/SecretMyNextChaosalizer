import * as THREE from "three";
import { Vector3 } from "three";

function lorenz(
  pos: Vector3,
  s: number = 10,
  r: number = 28,
  b: number = 2.667
) {
  return new Vector3(
    s * (pos.y - pos.x),
    r * pos.x - pos.y - pos.x * pos.z,
    pos.x * pos.y - b * pos.z
  );
}

export function getLorenzCurve(
  initial_pos: Vector3,
  steps: number = 10000,
  dt: number = 0.01
) {
  const curve = new THREE.CatmullRomCurve3([initial_pos]);
  for (let i = 0; i < steps; i++) {
    const last = curve.points[curve.points.length - 1];
    curve.points.push(last.add(lorenz(last).multiplyScalar(dt)));
  }

  console.log(curve.points);

  const geometry = new THREE.BufferGeometry().setFromPoints(curve.points);
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const curveObject = new THREE.Line(geometry, material);
  console.log(geometry);

  return curveObject;
}
