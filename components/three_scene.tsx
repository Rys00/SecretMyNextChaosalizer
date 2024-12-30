"use client";

import { getDefaultLorenzSystem, getDefaultRosslerSystem, getLorenzSystem, getRosslerSystem } from "@/utils/systemSimulationObject";
import CanvasRoot from "@/utils/three/canvas_root";
import { LegacyRef, MutableRefObject, useEffect, useRef } from "react";
import Slider from "./slider";
import { LORENZ_LABELS, ROSSLER_LABELS } from "./constants";

enum SystemType{
  LORENZ,
  ROSSLER
};

const ThreeScene = () => {
  const ref = useRef<HTMLDivElement>();
  let renderer: HTMLCanvasElement | undefined;
  let currentSystem: SystemType =  SystemType.LORENZ;
  let root : CanvasRoot;

  const generateCorrectSystem = (type: SystemType, values: Array<number> = []) => {
    switch(type){
      case SystemType.LORENZ:
        return getLorenzSystem(values);;
        break;
      case SystemType.ROSSLER:
        return getRosslerSystem(values);
        break;
    }
    return getLorenzSystem();
  };

  const getCorrectLabels = (type: SystemType) =>{
    switch(type){
      case SystemType.LORENZ:
        return LORENZ_LABELS;
      case SystemType.ROSSLER:
        return ROSSLER_LABELS;;
    }
    return LORENZ_LABELS;
  };

  const valueChange = (values: Array<number> = []) =>{
    if(typeof root === "undefined"){
      window.location.reload();
    }
    root.animations.pop();
    renderer = root.initSceneOn(ref as MutableRefObject<HTMLDivElement>);

    const newSystem = generateCorrectSystem(currentSystem, values);

    root.addToScene(newSystem.root);
    root.addAnimation(newSystem.getSystemAnimation());
  };

  const changeSystem = () => {
    if(currentSystem == SystemType.LORENZ) currentSystem = SystemType.ROSSLER;
    else currentSystem = SystemType.LORENZ;

    valueChange();

    return getCorrectLabels(currentSystem);
  };

  useEffect(() => {
    root = new CanvasRoot();
    renderer = root.initSceneOn(ref as MutableRefObject<HTMLDivElement>);

    const system = generateCorrectSystem(currentSystem);

    root.addToScene(system.root);
    root.addAnimation(system.getSystemAnimation());

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (renderer) ref.current?.removeChild(renderer);
    };
  }, []);

  return (<div ref={ref as LegacyRef<HTMLDivElement>} >
    <Slider props = {{changeFunction: valueChange, 
                  labels: getCorrectLabels(currentSystem),
                  changeSystemFunction: changeSystem}} /> 
  </div>);
};

export default ThreeScene;
