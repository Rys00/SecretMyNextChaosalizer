import { Color, Vector3 } from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";
import CanvasRoot from "./three/canvas_root";

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

export function addLorenzSystem(
  root_pos: Vector3,
  amount: number,
  canvas: CanvasRoot,
  epsilon: number = 0.01,
  steps: number = 10000,
  dt: number = 0.01,
  colorGradient: [Color, Color] | undefined = undefined
) {
  if (!colorGradient)
    colorGradient = [new Color(0x000000), new Color(0xffffff)];

  for (let i = 0; i < amount; i++) {
    const curve = getLorenzCurve(
      new Vector3().copy(root_pos).add(new Vector3(0, 0, epsilon * i)),
      steps
    );
    const dot = canvas.genBloomDot();

    curve.position.y = -25;
    curve.rotation.x = -Math.PI / 2;

    curve.geometry.instanceCount = 0;
    const instances = curve.geometry.attributes.instanceStart.array;
    canvas.addAnimation(() => {
      curve.rotation.z += 0.01;
      curve.geometry.instanceCount = curve.geometry.instanceCount + 1;
      const off = 6 * curve.geometry.instanceCount;

      dot.position.copy(
        curve.localToWorld(
          new Vector3(instances[off], instances[off + 1], instances[off + 2])
        )
      );
    });
    curve.material.color.lerpColors(
      colorGradient[0],
      colorGradient[1],
      i / amount
    );
    dot.material.color.lerpColors(
      colorGradient[0],
      colorGradient[1],
      i / amount
    );

    canvas.addToScene(curve);
    canvas.addToScene(dot);
  }
}
