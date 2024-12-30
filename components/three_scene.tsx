"use client";

import { getDefaultLorenzSystem, getLorenzSystem } from "@/utils/systemSimulationObject";
import CanvasRoot from "@/utils/three/canvas_root";
import { LegacyRef, MutableRefObject, useEffect, useRef } from "react";
import Slider from "./slider";

const ThreeScene = () => {
  const ref = useRef<HTMLDivElement>();
  let root : CanvasRoot;
  let renderer: HTMLCanvasElement | undefined;

  const valueChange = (values: Array<number>) =>{
    root.animations.pop();
    renderer = root.initSceneOn(ref as MutableRefObject<HTMLDivElement>);

    const newSystem = getLorenzSystem(values[0], values[1], values[2]);

    root.addToScene(newSystem.root);
    root.addAnimation(newSystem.getSystemAnimation());
  };

  useEffect(() => {
    root = new CanvasRoot();
    renderer = root.initSceneOn(ref as MutableRefObject<HTMLDivElement>);

    const system = getDefaultLorenzSystem();

    root.addToScene(system.root);
    root.addAnimation(system.getSystemAnimation());

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (renderer) ref.current?.removeChild(renderer);
    };
  }, []);

  return (<div ref={ref as LegacyRef<HTMLDivElement>} >
    <Slider props = {{changeFunction: valueChange, 
                            noSliders: 3}} /> 
  </div>);
};

export default ThreeScene;
