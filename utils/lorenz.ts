import { Vector3 } from "three";
import { RK4Curve } from "./rk4";

export class LorenzRK4 extends RK4Curve {
  sigma: number;
  rho: number;
  beta: number;
  variables: number;
  labels: Array<String>;

  constructor(
    pos0: Vector3,
    step: number = 0.01,
    sigma: number = 10,
    rho: number = 28,
    beta: number = 2.667
  ) {
    super(pos0, step);

    this.sigma = sigma;
    this.rho = rho;
    this.beta = beta;
    this.variables = 3;
    this.labels = ["sigma", "rho", "beta"]
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
}
