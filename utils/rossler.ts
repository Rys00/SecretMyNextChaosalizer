import { Vector3 } from "three";
import { RK4Curve } from "./rk4";

export class RosslerRK4 extends RK4Curve {
  a: number;
  b: number;
  c: number;
  variables: number;
  labels: Array<String>;

  constructor(
    pos0: Vector3,
    step: number = 0.05,
    a: number = 0.2,
    b: number = 0.2,
    c: number = 5.7
  ) {
    super(pos0, step);

    this.a = a;
    this.b = b;
    this.c = c;
    this.variables = 2;
    this.labels = ["a", "b"];
  }

  dx(pos: Vector3): number {
    return -pos.y - pos.z; //                    - y - z
  }
  dy(pos: Vector3): number {
    return pos.x + this.a * pos.y; //            x + a * y
  }
  dz(pos: Vector3): number {
    return this.b + pos.z * (pos.x - this.c); // b + z * (x - c)
  }
}
