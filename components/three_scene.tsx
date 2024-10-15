"use client";

import { getLorenzCurve } from "@/utils/lorenz";
import { addAnimation, addToScene, initScene } from "@/utils/three";
import { LegacyRef, MutableRefObject, useEffect, useRef } from "react";
import { Color, Vector3 } from "three";

const ThreeScene = () => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const renderer = initScene(ref as MutableRefObject<HTMLDivElement>);

    const steps = 10000;
    const gradient = [new Color(0xe8ea61), new Color(0xe4352f)];
    const amount = 3;
    const epsilon = 0.01;

    for (let i = 0; i < amount; i++) {
      const curve = getLorenzCurve(
        new Vector3(0, 1, 1.05 + epsilon * i),
        steps
      );

      curve.position.y = -25;
      curve.rotation.x = -Math.PI / 2;
      console.log(curve);

      curve.geometry.instanceCount = 0;
      addAnimation(() => {
        curve.rotation.z += 0.01;
        curve.geometry.instanceCount = curve.geometry.instanceCount + 1;
      });
      curve.material.color.lerpColors(gradient[0], gradient[1], i / amount);

      addToScene(curve);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (renderer) ref.current?.removeChild(renderer);
    };
  }, []);

  return <div ref={ref as LegacyRef<HTMLDivElement>}></div>;
};

export default ThreeScene;
