import React, { useRef, Suspense, useEffect, useState } from 'react'; // Import useEffect and useState
import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
// Correct the import path to match your file name 'Skrillex_.jsx'
import { Model as SkrillexModel } from './Skrillex_.jsx'; 
import { animate } from 'framer-motion'; 
import { useInView } from 'framer-motion'; 

function Scene() {
  const groupRef = useRef();
  // Add a state to track if the model has loaded
  const [isLoaded, setIsLoaded] = useState(false);

  // We use useEffect now, and it will re-run when isLoaded changes
  useEffect(() => {
    let animationControls;

    // Only run the animation IF the model is loaded and the ref is available
    if (isLoaded && groupRef.current) {
        // Set initial state: invisible and ready for animation
        groupRef.current.traverse((child) => {
            if (child.isMesh) {
                // Ensure material is transparent before setting opacity
                if (!child.material.transparent) {
                    child.material.transparent = true;
                }
                child.material.opacity = 0; 
            }
        });

        // Make the group visible *after* setting initial opacity
        groupRef.current.visible = true; 
        
        // Start the fade-in animation
        animationControls = animate(0, 0.8, { // Animate to 80% opacity
            duration: 1.2, 
            delay: 0.5, // Sync with name animation
            onUpdate: (latest) => {
                // Check ref again inside animation loop
                if (groupRef.current) { 
                    groupRef.current.traverse((child) => {
                        if (child.isMesh) {
                            child.material.opacity = latest;
                        }
                    });
                }
            }
        });
    }
    // Cleanup function to stop animation if the component unmounts
    return () => animationControls?.stop();
  }, [isLoaded]); // <-- Dependency array: This effect runs when isLoaded becomes true

  // This hook handles the continuous rotation and mouse interaction
  useFrame((state, delta) => {
    // Only animate if the model is loaded
    if (isLoaded && groupRef.current) {
      const autoRotationY = state.clock.getElapsedTime() * 0.1;
      const targetRotationY = autoRotationY + state.mouse.x * 2;
      const targetRotationX = state.mouse.y * -0.6;

      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    // Suspense handles the model loading phase
    <Suspense fallback={null}> 
      <ambientLight intensity={2.5} />
      <directionalLight position={[10, 10, 1]} intensity={5} />
      
      {/* Group ref is attached here. Starts invisible. */}
      <group 
        ref={groupRef} 
        scale={0.0001} 
        position={[0, 0.5, 0]} 
        rotation={[-0.1, 0.4, 0]}
        visible={false} // Start invisible, effect will make it visible
      >
        <Center>
          {/* Pass the onLoad callback to set our state */}
          <SkrillexModel onLoad={() => setIsLoaded(true)} /> 
        </Center>
      </group>
    </Suspense>
  );
}

export default function HeroCanvas() {
   const containerRef = useRef();
   // Check if the container itself is in view. 
   const isInView = useInView(containerRef, { margin: "200px 0px 200px 0px", once: false });

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      {/* Conditionally render Canvas or pause rendering via frameloop */}
      <Canvas 
        frameloop={isInView ? 'always' : 'never'} // THE KEY OPTIMIZATION
        camera={{ 
          position: [0, 6, 14],
          fov: 40
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

