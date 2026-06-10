import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import gsap from "gsap";
import { useConfiguratorStore } from "@/store/configurator-store";
import { CAMERA_VIEWS } from "@/lib/configurator/camera-views";

const IDLE_RESUME_MS = 6000;

interface CameraRigProps {
  center: THREE.Vector3;
  radius: number;
}

/**
 * Orbit controls with idle auto-rotation plus GSAP-eased camera transitions
 * that frame the active customization category. Framing is computed
 * relative to the model's bounding sphere so it adapts to any GLB.
 */
export function CameraRig({ center, radius }: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { camera } = useThree();

  const activeCategory = useConfiguratorStore((s) => s.activeCategory);
  const autoRotate = useConfiguratorStore((s) => s.autoRotate);
  const setAutoRotate = useConfiguratorStore((s) => s.setAutoRotate);

  useEffect(() => {
    if (radius <= 0) return;

    const view = CAMERA_VIEWS[activeCategory ?? "default"];
    const direction = new THREE.Vector3(...view.direction).normalize();
    const targetPosition = center.clone().addScaledVector(direction, radius * view.distance);

    const lookAt = center.clone();
    if (view.targetOffset) {
      lookAt.addScaledVector(new THREE.Vector3(...view.targetOffset), radius);
    }

    // Auto-rotation fights a direct position tween (both write to
    // camera.position each frame), causing visible jitter — pause it for
    // the duration of the transition and let the idle timer resume it.
    clearTimeout(idleTimer.current);
    const wasAutoRotating = autoRotate;
    if (wasAutoRotating) setAutoRotate(false);

    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        if (wasAutoRotating) {
          idleTimer.current = setTimeout(() => setAutoRotate(true), IDLE_RESUME_MS);
        }
      },
    });

    const controls = controlsRef.current;
    if (controls) {
      gsap.to(controls.target, {
        x: lookAt.x,
        y: lookAt.y,
        z: lookAt.z,
        duration: 1.2,
        ease: "power3.inOut",
        onUpdate: () => controls.update(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, center, radius, camera]);

  const handleInteractionStart = () => {
    clearTimeout(idleTimer.current);
    if (autoRotate) setAutoRotate(false);
  };

  const handleInteractionEnd = () => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setAutoRotate(true), IDLE_RESUME_MS);
  };

  useEffect(() => () => clearTimeout(idleTimer.current), []);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      autoRotate={autoRotate}
      autoRotateSpeed={0.6}
      minDistance={Math.max(radius * 1.3, 0.1)}
      maxDistance={Math.max(radius * 4, 1)}
      minPolarAngle={Math.PI * 0.18}
      maxPolarAngle={Math.PI * 0.82}
      enableDamping
      dampingFactor={0.08}
      onStart={handleInteractionStart}
      onEnd={handleInteractionEnd}
    />
  );
}
