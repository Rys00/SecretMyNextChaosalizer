import { Vector3 } from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";

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
  const points = [initial_pos];
  for (let i = 0; i < steps; i++) {
    const last = new Vector3().copy(points[i]);
    points.push(last.add(lorenz(last).multiplyScalar(dt)));
  }

  const geometry = new LineGeometry().setPositions(
    points.reduce<number[]>((acc, point) => {
      acc.push(point.x, point.y, point.z);
      return acc;
    }, [])
  );
  const material = new LineMaterial({
    color: 0xff0000,
    linewidth: 3,
  });
  const curveObject = new Line2(geometry, material);

  return curveObject;
}
