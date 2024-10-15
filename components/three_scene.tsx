"use client";

import { getLorenzCurve } from "@/utils/lorenz";
import { addAnimation, addToScene, initScene } from "@/utils/three";
import { LegacyRef, MutableRefObject, useEffect, useRef } from "react";
import { Vector3 } from "three";

const ThreeScene = () => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const renderer = initScene(ref as MutableRefObject<HTMLDivElement>);
    const curve = getLorenzCurve(new Vector3(0, 1, 1.05));
    addAnimation(() => {
      curve.rotation.y += 0.01;
    });
    addToScene(curve);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (renderer) ref.current?.removeChild(renderer);
    };
  }, []);

  return <div ref={ref as LegacyRef<HTMLDivElement>}></div>;
};

export default ThreeScene;
