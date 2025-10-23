import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { Model as SkrillexModel } from './Skrillex_.jsx'; 
import { animate } from 'framer-motion'; // Use framer-motion's animate function

function Scene() {
  const groupRef = useRef();
  // State to control visibility, preventing the initial flash
  const [isReady, setIsReady] = useState(false);

  // This useEffect handles the initial fade-in animation for the model AFTER it's ready
  useEffect(() => {
    let animationControls;
    if (isReady && groupRef.current) {
      // Animate the opacity of all materials from 0 to 0.8 (or 1 if you prefer fully opaque)
      animationControls = animate(0, 0.8, {
        duration: 1.2, // Animation duration
        delay: 0.5,    // Delay to sync with the name animation
        onUpdate: (latest) => {
          groupRef.current.traverse((child) => {
            if (child.isMesh) {
              // Ensure material is transparent before setting opacity
              if (!child.material.transparent) {
                 child.material.transparent = true;
              }
              child.material.opacity = latest;
            }
          });
        }
      });
    }
    // Cleanup function to stop animation if the component unmounts
    return () => animationControls?.stop();
  }, [isReady]); // Depend on isReady state

  // This hook handles the continuous rotation and mouse interaction
  useFrame((state, delta) => {
    if (groupRef.current) {
      const autoRotationY = state.clock.getElapsedTime() * 0.1;
      const targetRotationY = autoRotationY + state.mouse.x * 2;
      const targetRotationX = state.mouse.y * -0.6;

      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    }
  });

  // This effect marks the model as ready AFTER the initial render with Suspense
  useEffect(() => {
     // Small delay to ensure everything is mounted
     const timer = setTimeout(() => setIsReady(true), 100); 
     return () => clearTimeout(timer);
  }, []);

  return (
    // Suspense handles the loading state, fallback ensures nothing shows until ready
    <Suspense fallback={null}> 
      <ambientLight intensity={2.5} />
      <directionalLight position={[10, 10, 1]} intensity={5} />
      
      {/* Group is only visible when isReady is true */}
      <group 
        ref={groupRef} 
        scale={0.0001} 
        position={[0, 0.5, 0]} 
        rotation={[-0.1, 0.4, 0]}
        visible={isReady} // Control visibility with state
      >
        <Center>
          <SkrillexModel /> 
        </Center>
      </group>
    </Suspense>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ 
          position: [0, 6, 14],
          fov: 40
      }}>
        <Scene />
      </Canvas>
    </div>
  );
}

