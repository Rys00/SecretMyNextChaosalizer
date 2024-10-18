import { Color, ColorRepresentation, Mesh, Vector3 } from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/Addons.js";
import { getColorHSL, setColorLightness } from "./three/utils";

export class RK4Curve {
  points: Vector3[];

  step: number;
  animSpeed: number = 1;
  strip: boolean = false;
  fadeLength: number = 3;

  color: Color;
  colors: number[];

  constructor(pos0: Vector3, step: number = 0.01) {
    if (this.constructor == RK4Curve) {
      throw new Error(
        "RK4Curve class is abstract and can not be instantiated."
      );
    }

    this.points = [new Vector3().copy(pos0)];
    this.step = step;
    this.color = new Color(0xff0000);
    this.colors = [];
  }

  dx(pos: Vector3): number {
    return pos.x * 0;
  }
  dy(pos: Vector3): number {
    return pos.y * 0;
  }
  dz(pos: Vector3): number {
    return pos.z * 0;
  }
  dVec(pos: Vector3): Vector3 {
    return new Vector3(this.dx(pos), this.dy(pos), this.dz(pos));
  }

  kVec(pos: Vector3): [Vector3, Vector3, Vector3, Vector3] {
    const k1 = this.dVec(pos); //                                         k1 = dVec(pos)
    const off1 = new Vector3().copy(k1).multiplyScalar(this.step / 2); // off1 = k1 * step / 2
    const k2 = this.dVec(new Vector3().copy(pos).add(off1)); //           k2 = dVec(pos + off1)
    const off2 = new Vector3().copy(k2).multiplyScalar(this.step / 2); // off2 = k2 * step / 2
    const k3 = this.dVec(new Vector3().copy(pos).add(off2)); //           k3 = dVec(pos + off2)
    const off3 = new Vector3().copy(k3).multiplyScalar(this.step); //     off3 = k3 * step
    const k4 = this.dVec(new Vector3().copy(pos).add(off3)); //           k4 = dVec(pos + off3)
    return [k1, k2, k3, k4];
  }

  genNextPoint() {
    const result = new Vector3().copy(
      this.points.length ? this.points[this.points.length - 1] : new Vector3()
    );

    const kVec = this.kVec(result); // [k1, k2, k3, k4]

    const off = new Vector3()
      .copy(kVec[0]) //                  (k1
      .add(kVec[1].multiplyScalar(2)) // + 2 * k2
      .add(kVec[2].multiplyScalar(2)) // + 2 * k3
      .add(kVec[3]) //                   + k4)
      .multiplyScalar(this.step / 6); // / 6 * step

    this.points.push(result);
    if (this.strip) this.points.splice(0, 1);
    return result.add(off);
  }

  genNextPoints(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.genNextPoint();
    }
  }

  updateColors() {
    this.colors = [];
    const baseHSL = getColorHSL(this.color);
    const threshold = Math.min(
      Math.floor(this.fadeLength / this.step),
      this.points.length
    );
    for (let i = 0; i < this.points.length; i++) {
      const color = setColorLightness(
        this.color,
        (threshold > 0 ? Math.min(1, i / threshold) : 1) * baseHSL.l
      );
      this.colors.push(color.r, color.g, color.b);
    }
  }

  getCurveObject(color: ColorRepresentation = 0xff0000, width: number = 2) {
    this.color = new Color(color);
    const material = new LineMaterial({
      color: 0xffffff,
      vertexColors: true,
      linewidth: width,
      transparent: true,
    });
    const curveObject = new Line2();
    curveObject.material = material;
    this.updateColors();
    this.updateCurveObject(curveObject);
    return curveObject;
  }

  updateCurveObject(curve: Line2) {
    if (!this.strip) {
      this.updateColors();
    }
    curve.geometry.dispose();
    const newGeometry = new LineGeometry();
    if (this.points.length === 1) this.points.push(this.points[0]);
    newGeometry.setPositions(
      this.points.reduce<number[]>((acc, point) => {
        acc.push(point.x, point.y, point.z);
        return acc;
      }, [])
    );
    newGeometry.setColors(this.colors);
    curve.geometry = newGeometry;
  }

  getCurveAnimation(
    curveObject: Line2,
    headObject: Mesh | undefined = undefined
  ) {
    let deltaLeftover = 0;
    return (delta: number) => {
      const pointsNeeded = (delta / this.step) * this.animSpeed + deltaLeftover;
      deltaLeftover = pointsNeeded - Math.floor(pointsNeeded);
      this.genNextPoints(Math.floor(pointsNeeded));
      this.updateCurveObject(curveObject);

      if (headObject) {
        const instances = curveObject.geometry.attributes.instanceStart.array;
        const off = instances.length - 3;
        headObject.position.copy(
          new Vector3(instances[off], instances[off + 1], instances[off + 2])
        );
      }
    };
  }
}
