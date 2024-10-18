import { MutableRefObject } from "react";
import {
  Clock,
  Layers,
  Material,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  ReinhardToneMapping,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/Addons.js";
import {
  BLOOM_FRAGMENT_SHADER,
  BLOOM_VERTEX_SHADER,
  disposeMaterial,
  getAnimate,
  getOnWindowResize,
} from "./utils";

export const BLOOM_SCENE_ID = 1;

export default class CanvasRoot {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: OrbitControls;
  animations: CallableFunction[] = [];
  renderScene: RenderPass;
  bloomParams = {
    threshold: 0,
    strength: 0.5,
    radius: 0,
    exposure: 1,
  };
  bloomPass: UnrealBloomPass;
  bloomComposer: EffectComposer;
  mixPass: ShaderPass;
  outputPass: OutputPass;
  finalComposer: EffectComposer;
  bloomLayer: Layers;
  darkMaterial = new MeshBasicMaterial({ color: "black" });
  materials: Map<string, Material | Material[]> = new Map<
    string,
    Material | Material[]
  >();
  clock: Clock;

  constructor() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 75);

    this.clock = new Clock();

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.toneMapping = ReinhardToneMapping;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 500;

    this.bloomLayer = new Layers();
    this.bloomLayer.set(BLOOM_SCENE_ID);
    this.renderScene = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = this.bloomParams.threshold;
    this.bloomPass.strength = this.bloomParams.strength;
    this.bloomPass.radius = this.bloomParams.radius;
    this.bloomComposer = new EffectComposer(this.renderer);
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass(this.renderScene);
    this.bloomComposer.addPass(this.bloomPass);
    this.mixPass = new ShaderPass(
      new ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
        },
        vertexShader: BLOOM_VERTEX_SHADER,
        fragmentShader: BLOOM_FRAGMENT_SHADER,
        defines: {},
      }),
      "baseTexture"
    );
    this.mixPass.needsSwap = true;
    this.outputPass = new OutputPass();
    this.finalComposer = new EffectComposer(this.renderer);
    this.finalComposer.addPass(this.renderScene);
    this.finalComposer.addPass(this.mixPass);
    this.finalComposer.addPass(this.outputPass);

    this.renderer.setAnimationLoop(getAnimate(this));
  }

  initSceneOn(element: MutableRefObject<HTMLDivElement>) {
    if (!WebGL.isWebGL2Available()) {
      const warning = WebGL.getWebGL2ErrorMessage();
      element.current.appendChild(warning);
      return undefined;
    }

    this.scene.clear();
    element.current.appendChild(this.renderer.domElement);

    this.addAnimation(() => {
      this.controls.update();
    });

    window.addEventListener("resize", getOnWindowResize(this));
    window.dispatchEvent(new Event("resize"));

    this.scene.traverse(disposeMaterial);

    return this.renderer.domElement;
  }

  addAnimation(animation: CallableFunction) {
    this.animations.push(animation);
  }

  addToScene(object: Object3D) {
    this.scene.add(object);
  }
}
