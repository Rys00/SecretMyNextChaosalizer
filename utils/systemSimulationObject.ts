import { Color, Group, Vector3 } from "three";
import { LorenzRK4 } from "./lorenz";
import { RK4 } from "./rk4";
import { RosslerRK4 } from "./rossler";
import { genBloomDot, setColorLightness } from "./three/utils";

export enum SystemType {
  Lorenz,
  Rossler,
}

type SystemArgs =
  | {
      [SystemType.Lorenz]: ConstructorParameters<typeof LorenzRK4>;
    }
  | {
      [SystemType.Rossler]: ConstructorParameters<typeof RosslerRK4>;
    };

export class SystemSimulationObject {
  root: Group;
  systemClass: typeof RK4;
  systemArgs: ConstructorParameters<typeof this.systemClass>;
  amount: number;
  epsilon: number;
  colorGradient: [Color, Color];
  tail: number | boolean;
  idleRotation: number;
  animSpeed: number;
  systemInstances: RK4[];
  instancesAnimations: CallableFunction[];

  constructor(
    system: SystemArgs,
    amount: number,
    epsilon: number = 0.01,
    colorGradient: [Color, Color] | undefined = undefined,
    tail: number | boolean = 30,
    idleRotation: number = 0.5,
    animSpeed: number = 1
  ) {
    this.root = new Group();

    const systemType = parseInt(Object.keys(system)[0]) as SystemType;
    switch (systemType) {
      case SystemType.Lorenz:
        this.systemClass = LorenzRK4;
        break;
      case SystemType.Rossler:
        this.systemClass = RosslerRK4;
        break;
      default:
        this.systemClass = RK4;
        break;
    }
    this.systemArgs = Object.values(system)[0] as ConstructorParameters<
      typeof this.systemClass
    >;

    this.amount = amount;
    this.epsilon = epsilon;
    this.colorGradient = colorGradient || [
      new Color(0x000000),
      new Color(0xffffff),
    ];
    this.tail = tail;
    this.idleRotation = idleRotation;
    this.animSpeed = animSpeed;

    this.systemInstances = [];
    this.instancesAnimations = [];

    this.regenerateInstances();
  }

  regenerateInstances() {
    for (let i = 0; i < this.amount; i++) {
      const newInstance = new this.systemClass(...this.systemArgs);
      newInstance.points[0].z += this.epsilon * i;
      newInstance.animSpeed = this.animSpeed;

      if (!this.tail) newInstance.strip = true;
      else if (this.tail === true) newInstance.strip = false;
      else {
        newInstance.strip = false;
        setTimeout(() => {
          newInstance.strip = true;
        }, this.tail * 1000);
      }

      const color = new Color().lerpColors(
        this.colorGradient[0],
        this.colorGradient[1],
        i / this.amount
      );

      const curve = newInstance.getCurveObject(
        setColorLightness(color, 0.066),
        2
      );
      const head = genBloomDot(0.5, color, 1);

      this.systemInstances.push(newInstance);
      this.instancesAnimations.push(newInstance.getCurveAnimation(curve, head));

      this.root.add(curve);
      this.root.add(head);
    }
  }

  getSystemAnimation() {
    return (delta: number) => {
      this.instancesAnimations.forEach((animation) => animation(delta));
      this.root.rotation.z += delta * this.idleRotation;
    };
  }
}

export function getDefaultLorenzSystem() {
  const lorenzSystem = new SystemSimulationObject(
    {
      [SystemType.Lorenz]: [new Vector3(0, 1, 1.05)],
    },
    3,
    0.01,
    [new Color(0xe8ea61), new Color(0xe4352f)],
    3,
    0.5,
    1
  );

  lorenzSystem.root.rotation.x = -Math.PI / 2;
  lorenzSystem.root.position.y = -25;

  return lorenzSystem;
}

export function getDefaultRosslerSystem() {
  const rosslerSystem = new SystemSimulationObject(
    {
      [SystemType.Rossler]: [new Vector3(0, 1, 1.05)],
    },
    3,
    0.01,
    [new Color(0xe8ea61), new Color(0xe4352f)],
    10,
    0.5,
    5
  );

  rosslerSystem.root.rotation.x = -Math.PI / 2;
  rosslerSystem.root.position.y = -15;

  return rosslerSystem;
}
