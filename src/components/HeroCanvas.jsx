import React, { useRef, Suspense, useLayoutEffect } from 'react'; 
import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { Model as SkrillexModel } from './Skrillex.jsx'; 
import { animate } from 'framer-motion'; 
import { useInView } from 'framer-motion'; // Import useInView

function Scene() {
  const groupRef = useRef();

  // Use useLayoutEffect for DOM-synchronous operations like initial setup
  useLayoutEffect(() => {
    let animationControls;
    // Check if the ref is populated (model is mounted and rendered)
    if (groupRef.current) {
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
                // Check ref again inside animation loop (important!)
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
  }, []); // Empty dependency array ensures this runs once after mount and layout

  // This hook handles the continuous rotation and mouse interaction
  useFrame((state, delta) => {
    // No need to check isInView here anymore, as the entire render loop is paused
    if (groupRef.current) {
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
        visible={false} // Start invisible, effect makes it visible
      >
        <Center>
          <SkrillexModel /> 
        </Center>
      </group>
    </Suspense>
  );
}

export default function HeroCanvas() {
   const containerRef = useRef();
   // Check if the container itself is in view. 
   // Adjust margin for smoother start/stop, e.g., trigger when 200px away.
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

