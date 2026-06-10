import { Bloom, EffectComposer, N8AO, SMAA, Vignette } from "@react-three/postprocessing";

/**
 * Post-processing pipeline: screen-space ambient occlusion for grounded
 * contact, a restrained bloom for specular highlights, subtle vignette for
 * focus, and SMAA for crisp anti-aliased edges.
 */
export function SceneEffects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass>
      <N8AO
        aoRadius={0.4}
        intensity={1.4}
        distanceFalloff={1}
        screenSpaceRadius
        halfRes
        aoSamples={6}
        denoiseSamples={4}
      />
      <Bloom luminanceThreshold={1.05} luminanceSmoothing={0.3} intensity={0.35} mipmapBlur />
      <Vignette eskil={false} offset={0.18} darkness={0.6} />
      <SMAA />
    </EffectComposer>
  );
}
