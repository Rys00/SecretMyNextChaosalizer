import { Color, ColorRepresentation, HSL, Vector3 } from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";
import CanvasRoot from "./three/canvas_root";
export class LorenzRK4 {
  points: Vector3[];

  sigma: number;
  rho: number;
  beta: number;

  constructor(
    pos0: Vector3,
    sigma: number = 10,
    rho: number = 28,
    beta: number = 2.667
  ) {
    this.sigma = sigma;
    this.rho = rho;
    this.beta = beta;

    this.points = [new Vector3().copy(pos0)];
  }

  dx(pos: Vector3): number {
    return this.sigma * (pos.y - pos.x); //             sigma * (y - x)
  }
  dy(pos: Vector3): number {
    return this.rho * pos.x - pos.y - pos.x * pos.z; // rho * x - y - x * z
  }
  dz(pos: Vector3): number {
    return pos.x * pos.y - this.beta * pos.z; //        x - y - beta * z
  }
  dVec(pos: Vector3): Vector3 {
    return new Vector3(this.dx(pos), this.dy(pos), this.dz(pos));
  }

  kVec(pos: Vector3, dt: number = 0.01): [Vector3, Vector3, Vector3, Vector3] {
    const k1 = this.dVec(pos); //                                         k1 = dVec(pos)
    const off1 = new Vector3().copy(k1).multiplyScalar(dt / 2); //        off1 = k1 * dt / 2
    const k2 = this.dVec(new Vector3().copy(pos).add(off1)); //           k2 = dVec(pos + off1)
    const off2 = new Vector3().copy(k2).multiplyScalar(dt / 2); //        off2 = k2 * dt / 2
    const k3 = this.dVec(new Vector3().copy(pos).add(off2)); //           k3 = dVec(pos + off2)
    const off3 = new Vector3().copy(k3).multiplyScalar(dt); //            off3 = k3 * dt
    const k4 = this.dVec(new Vector3().copy(pos).add(off3)); //           k4 = dVec(pos + off3)
    return [k1, k2, k3, k4];
  }

  genNextPoint(dt: number = 0.01, strip: boolean = false) {
    const result = new Vector3().copy(
      this.points.length ? this.points[this.points.length - 1] : new Vector3()
    );

    const kVec = this.kVec(result, dt); // [k1, k2, k3, k4]

    const off = new Vector3()
      .copy(kVec[0]) //                  (k1
      .add(kVec[1].multiplyScalar(2)) // + 2 * k2
      .add(kVec[2].multiplyScalar(2)) // + 2 * k3
      .add(kVec[3]) //                   + k4)
      .multiplyScalar(dt / 6); //        / 6 * step

    this.points.push(result);
    if (strip) this.points.splice(0, 1);
    return result.add(off);
  }

  genNextPoints(amount: number, dt: number = 0.01, strip: boolean = false) {
    for (let i = 0; i < amount; i++) {
      this.genNextPoint(dt, strip);
    }
  }

  getCurveGeometry() {
    return new LineGeometry().setPositions(
      this.points.reduce<number[]>((acc, point) => {
        acc.push(point.x, point.y, point.z);
        return acc;
      }, [])
    );
  }

  getCurve(color: ColorRepresentation = 0xff0000, width: number = 2) {
    const material = new LineMaterial({
      color: color,
      linewidth: width,
    });
    const curveObject = new Line2(this.getCurveGeometry(), material);

    return curveObject;
  }
}

export function addLorenzSystem(
  root_pos: Vector3,
  amount: number,
  canvas: CanvasRoot,
  epsilon: number = 0.01,
  dt: number = 0.01,
  colorGradient: [Color, Color] | undefined = undefined,
  tailSeconds: number = 30,
  animSpeed: number = 1
) {
  if (!colorGradient)
    colorGradient = [new Color(0x000000), new Color(0xffffff)];

  const pos = new Vector3().copy(root_pos);
  for (let i = 0; i < amount; i++) {
    const lorenz = new LorenzRK4(pos);
    // lorenz.genNextPoints(Math.floor(tailTime / dt));
    const curve = lorenz.getCurve();
    const dot = canvas.genBloomDot();

    curve.position.y = -25;
    curve.rotation.x = -Math.PI / 2;

    let strip = false;
    setTimeout(() => (strip = true), tailSeconds * 1000);

    canvas.addAnimation((delta: number) => {
      curve.rotation.z += delta / 2;

      curve.geometry.dispose();
      lorenz.genNextPoints(Math.floor((delta / dt) * animSpeed), dt, strip);
      curve.geometry = lorenz.getCurveGeometry();

      const instances = curve.geometry.attributes.instanceStart.array;
      const off = instances.length - 6;
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
    const hsl: HSL = {
      h: 0,
      s: 0,
      l: 0,
    };
    curve.material.color.getHSL(hsl);
    curve.material.color.setHSL(hsl.h, hsl.s, 0.066);
    dot.material.color.lerpColors(
      colorGradient[0],
      colorGradient[1],
      i / amount
    );

    canvas.addToScene(curve);
    canvas.addToScene(dot);

    pos.add(new Vector3(0, 0, epsilon));
  }
}
