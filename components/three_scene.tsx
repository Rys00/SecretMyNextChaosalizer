"use client";

import { getDefaultLorenzSystem } from "@/utils/systemSimulationObject";
import CanvasRoot from "@/utils/three/canvas_root";
import { LegacyRef, MutableRefObject, useEffect, useRef } from "react";

const ThreeScene = () => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const root = new CanvasRoot();
    const renderer = root.initSceneOn(ref as MutableRefObject<HTMLDivElement>);

    const system = getDefaultLorenzSystem();

    root.addToScene(system.root);
    root.addAnimation(system.getSystemAnimation());

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (renderer) ref.current?.removeChild(renderer);
    };
  }, []);

  return <div ref={ref as LegacyRef<HTMLDivElement>}></div>;
};

export default ThreeScene;
