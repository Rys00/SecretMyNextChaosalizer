"use client";

import { addLorenzSystem } from "@/utils/lorenz";
import CanvasRoot from "@/utils/three/canvas_root";
import { LegacyRef, MutableRefObject, useEffect, useRef } from "react";
import { Color, Vector3 } from "three";

const ThreeScene = () => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const root = new CanvasRoot();
    const renderer = root.initSceneOn(ref as MutableRefObject<HTMLDivElement>);

    addLorenzSystem(new Vector3(0, 1, 1.05), 3, root, 0.01, 0.01, [
      new Color(0xe8ea61),
      new Color(0xe4352f),
    ]);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (renderer) ref.current?.removeChild(renderer);
    };
  }, []);

  return <div ref={ref as LegacyRef<HTMLDivElement>}></div>;
};

export default ThreeScene;
