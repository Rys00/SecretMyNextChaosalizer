import { ColorRepresentation, Mesh, Vector3 } from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";

export class RK4 {
  points: Vector3[];

  step: number;
  animSpeed: number = 1;
  strip: boolean = false;

  constructor(pos0: Vector3, step: number = 0.01) {
    if (this.constructor == RK4) {
      throw new Error("RK4 class is abstract and can not be instantiated.");
    }

    this.points = [new Vector3().copy(pos0)];
    this.step = step;
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

  genNextPoint(strip: boolean = false) {
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
    if (strip) this.points.splice(0, 1);
    return result.add(off);
  }

  genNextPoints(amount: number, strip: boolean = false) {
    for (let i = 0; i < amount; i++) {
      this.genNextPoint(strip);
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

  getCurveObject(color: ColorRepresentation = 0xff0000, width: number = 2) {
    const material = new LineMaterial({
      color: color,
      linewidth: width,
    });
    const curveObject = new Line2(this.getCurveGeometry(), material);

    return curveObject;
  }

  getCurveAnimation(
    curveObject: Line2,
    headObject: Mesh | undefined = undefined
  ) {
    let deltaLeftover = 0;
    return (delta: number) => {
      curveObject.geometry.dispose();
      const pointsNeeded = (delta / this.step) * this.animSpeed + deltaLeftover;
      deltaLeftover = pointsNeeded - Math.floor(pointsNeeded);
      this.genNextPoints(Math.floor(pointsNeeded), this.strip);
      curveObject.geometry = this.getCurveGeometry();

      if (headObject) {
        const instances = curveObject.geometry.attributes.instanceStart.array;
        const off = instances.length - 6;
        headObject.position.copy(
          new Vector3(instances[off], instances[off + 1], instances[off + 2])
        );
      }
    };
  }
}
