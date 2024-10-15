"use client";

import { getLorenzCurve } from "@/utils/lorenz";
import CanvasRoot from "@/utils/three/canvas_root";
import { LegacyRef, MutableRefObject, useEffect, useRef } from "react";
import { Color, TypedArray, Vector3 } from "three";

const ThreeScene = () => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const root = new CanvasRoot();
    const renderer = root.initSceneOn(ref as MutableRefObject<HTMLDivElement>);

    const steps = 10000;
    const gradient = [new Color(0xe8ea61), new Color(0xe4352f)];
    const amount = 3;
    const epsilon = 0.01;

    for (let i = 0; i < amount; i++) {
      const curve = getLorenzCurve(
        new Vector3(0, 1, 1.05 + epsilon * i),
        steps
      );
      const dot = root.genBloomDot();

      curve.position.y = -25;
      curve.rotation.x = -Math.PI / 2;

      curve.geometry.instanceCount = 0;
      const instances: TypedArray =
        curve.geometry.attributes.instanceStart.array;
      root.addAnimation(() => {
        curve.rotation.z += 0.01;
        curve.geometry.instanceCount = curve.geometry.instanceCount + 1;
        const off = 6 * curve.geometry.instanceCount;

        dot.position.copy(
          curve.localToWorld(
            new Vector3(instances[off], instances[off + 1], instances[off + 2])
          )
        );
      });
      curve.material.color.lerpColors(gradient[0], gradient[1], i / amount);
      dot.material.color.lerpColors(gradient[0], gradient[1], i / amount);

      root.addToScene(curve);
      root.addToScene(dot);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (renderer) ref.current?.removeChild(renderer);
    };
  }, []);

  return <div ref={ref as LegacyRef<HTMLDivElement>}></div>;
};

export default ThreeScene;
