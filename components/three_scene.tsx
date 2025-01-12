"use client";

import { getLorenzSystem, getRosslerSystem, SystemSimulationObject, SystemType } from "@/utils/systemSimulationObject";
import CanvasRoot from "@/utils/three/canvas_root";
import { LegacyRef, MutableRefObject, useEffect, useRef } from "react";
import Slider from "./slider";
import { LORENZ_LABELS, ROSSLER_LABELS, SYSTEMS } from "./constants";
import "./three_scene.css"

const ThreeScene = () => {
  const ref = useRef<HTMLDivElement>();
  let renderer: HTMLCanvasElement | undefined;
  let currentSystem: SystemType =  SystemType.Lorenz;
  let root : CanvasRoot;
  let animatingSystem: SystemSimulationObject;

  const getSystemVariables = () =>{
    const variables = [...animatingSystem.systemArgs];
    variables.shift();
    variables.shift();

    const variables2 = [];
    for(let i = 0; i<variables.length; i++){
      if(variables[i] == null){
        variables2.push("error");
        continue;
      }else{
        variables2.push(variables[i]?.toString());
      }
    }

    return [SYSTEMS[currentSystem], ...variables2];
  };

  const getNAndEpsilon = () =>{
    const variables = [animatingSystem.amount, animatingSystem.epsilon];

    return [variables[0], variables[1]];
  };

  const generateCorrectSystem = (type: SystemType, values: Array<number> = []) => {
    switch(type){
      case SystemType.Lorenz:
        return getLorenzSystem(values);
        break;
      case SystemType.Rossler:
        return getRosslerSystem(values);
        break;
    }
    return getLorenzSystem();
  };

  const getCorrectLabels = (type: SystemType) =>{
    switch(type){
      case SystemType.Lorenz:
        return LORENZ_LABELS;
      case SystemType.Rossler:
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

    const newSystem = generateCorrectSystem(currentSystem, values, );

    root.addToScene(newSystem.root);
    root.addAnimation(newSystem.getSystemAnimation());

    animatingSystem = newSystem;
  };

  const changeSystem = () => {
    if(currentSystem == SystemType.Lorenz) currentSystem = SystemType.Rossler;
    else currentSystem = SystemType.Lorenz;

    valueChange();

    return getCorrectLabels(currentSystem);
  };

  function createSystem(){
    const system = generateCorrectSystem(currentSystem);
    animatingSystem = system;
  }

  createSystem();

  useEffect(() => {
    root = new CanvasRoot();
    renderer = root.initSceneOn(ref as MutableRefObject<HTMLDivElement>);

    const system = generateCorrectSystem(currentSystem);
    animatingSystem = system;

    root.addToScene(system.root);
    root.addAnimation(system.getSystemAnimation());

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (renderer) ref.current?.removeChild(renderer);
    };
  }, []);

  return (<div className="three-scene-outer-div-class">
    <Slider changeFunction={valueChange} 
              labels={getCorrectLabels(currentSystem)}
              changeSystemFunction={changeSystem}
              systemVariablesFunction={getSystemVariables}
              systemNAndVariables={getNAndEpsilon} /> 
    <div className="simulation-class">
      <div ref={ref as LegacyRef<HTMLDivElement>}></div>
    </div>
  </div>);
};

export default ThreeScene;
