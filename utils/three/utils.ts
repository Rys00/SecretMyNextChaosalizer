import * as THREE from "three";
import CanvasRoot from "./canvas_root";

export const disposeMaterial = (obj: THREE.Object3D) => {
  if (obj instanceof THREE.Mesh && obj.material) {
    obj.material.dispose();
  }
};

export const getDarkenNonBloomed =
  (context: CanvasRoot) => (obj: THREE.Object3D) => {
    if (
      obj instanceof THREE.Mesh &&
      context.bloomLayer.test(obj.layers) === false
    ) {
      context.materials.set(obj.uuid, obj.material);
      obj.material = context.darkMaterial;
    }
  };

export const getRestoreMaterial =
  (context: CanvasRoot) => (obj: THREE.Object3D) => {
    if (obj instanceof THREE.Mesh && context.materials.has(obj.uuid)) {
      obj.material = context.materials.get(obj.uuid);
      context.materials.delete(obj.uuid);
    }
  };

export const getAnimate = (context: CanvasRoot) => () => {
  context.animations.forEach((animation) => animation());

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
