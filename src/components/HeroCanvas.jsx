import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { Model as SkrillexModel } from './Skrillex.jsx'; 
import { animate } from 'framer-motion';

function Scene() {
  const groupRef = useRef();
  // State to control visibility, preventing the initial flash
  const [isReady, setIsReady] = useState(false);

  // This useEffect handles the initial fade-in animation for the model
  useEffect(() => {
    if (groupRef.current) {
      // Prepare all materials for transparency in the background
      groupRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = 0; // Start fully transparent
        }
      });

      // Once prepared, set the model to be visible
      setIsReady(true);

      // Animate the opacity of all materials from 0 to 0.8
      const controls = animate(0, 0.8, {
        duration: 1.5, // Animation duration
        delay: 0.5,    // Delay to sync with the name animation
        onUpdate: (latest) => {
          groupRef.current.traverse((child) => {
            if (child.isMesh) {
              child.material.opacity = latest;
            }
          });
        }
      });

      // Cleanup function to stop animation if the component unmounts
      return () => controls.stop();
    }
  }, []); // Empty array ensures this runs only once on mount

  // This hook handles the continuous rotation and mouse interaction
  useFrame((state, delta) => {
    if (groupRef.current) {
      const autoRotationY = state.clock.getElapsedTime() * 0.1;
      const targetRotationY = autoRotationY + state.mouse.x * 0.4;
      const targetRotationX = state.mouse.y * -0.4;

      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <Suspense fallback={null}> 
      <ambientLight intensity={2.5} />
      <directionalLight position={[10, 10, 1]} intensity={5} />
      
      {/* The 'visible' prop prevents rendering until the model is ready */}
      <group 
        ref={groupRef} 
        scale={0.0001} 
        position={[0, 0.5, 0]} 
        rotation={[-0.1, 0.4, 0]}
        visible={isReady}
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

