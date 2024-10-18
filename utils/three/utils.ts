import {
  Color,
  ColorRepresentation,
  HSL,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
} from "three";
import CanvasRoot, { BLOOM_SCENE_ID } from "./canvas_root";

export const disposeMaterial = (obj: Object3D) => {
  if (obj instanceof Mesh && obj.material) {
    obj.material.dispose();
  }
};

export const getDarkenNonBloomed = (context: CanvasRoot) => (obj: Object3D) => {
  if (obj instanceof Mesh && context.bloomLayer.test(obj.layers) === false) {
    context.materials.set(obj.uuid, obj.material);
    obj.material = context.darkMaterial;
  }
};

export const getRestoreMaterial = (context: CanvasRoot) => (obj: Object3D) => {
  if (obj instanceof Mesh && context.materials.has(obj.uuid)) {
    obj.material = context.materials.get(obj.uuid);
    context.materials.delete(obj.uuid);
  }
};

export const getAnimate = (context: CanvasRoot) => () => {
  const delta = context.clock.getDelta();

  context.animations.forEach((animation) => animation(delta));

  context.renderer.render(context.scene, context.camera);
  context.scene.traverse(getDarkenNonBloomed(context));
  context.bloomComposer.render();
  context.scene.traverse(getRestoreMaterial(context));
  context.finalComposer.render();
};

export const getOnWindowResize = (context: CanvasRoot) => () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  context.camera.aspect = width / height;
  context.camera.updateProjectionMatrix();

  context.renderer.setSize(width, height);
  context.bloomComposer.setSize(width, height);
  context.finalComposer.setSize(width, height);
};

export function genBloomDot(
  radius: number = 0.5,
  color: ColorRepresentation = 0xff0000,
  detail: number = 1
) {
  const geometry = new IcosahedronGeometry(radius, detail);
  const material = new MeshBasicMaterial({ color: color });
  const dot = new Mesh(geometry, material);
  dot.layers.enable(BLOOM_SCENE_ID);

  return dot;
}

export function setColorLightness(color: Color, value: number) {
  const colorHSL: HSL = {
    h: 0,
    s: 0,
    l: 0,
  };
  color.getHSL(colorHSL);
  return new Color().copy(color).setHSL(colorHSL.h, colorHSL.s, value);
}

export const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export const FRAGMENT_SHADER = `
uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;

varying vec2 vUv;

void main() {
  gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
}
`;
