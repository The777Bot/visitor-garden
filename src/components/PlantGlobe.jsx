import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Globe({ plants }) {
  const globeRef = useRef();
  const groupRef = useRef();
  
  // Optimize plant positions calculation
  const plantPositions = useMemo(() => {
    return plants.map(plant => {
      const phi = (plant.y / 3000) * Math.PI;
      const theta = (plant.x / 5000) * Math.PI * 2;
      return {
        position: [
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        ],
        type: plant.type
      };
    });
  }, [plants]);

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group>
      {/* Earth sphere with simple material */}
      <Sphere ref={globeRef} args={[3, 64, 64]}>
        <meshStandardMaterial
          color="#1a4d2e"
          metalness={0.1}
          roughness={0.7}
          emissive="#0a2e1a"
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Plants as points on the globe */}
      <group ref={groupRef}>
        {plantPositions.map((plant, index) => (
          <mesh key={index} position={plant.position}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial
              color={plant.type === 0 ? '#4ade80' : plant.type === 1 ? '#22c55e' : '#16a34a'}
              emissive={plant.type === 0 ? '#4ade80' : plant.type === 1 ? '#22c55e' : '#16a34a'}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Enhanced stars background with larger radius */}
      <Stars
        
        radius={1000}
        depth={200}
        count={30000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </group>
  );
}

export default function PlantGlobe({ plants = [] }) {
  return (
    <div className="w-[400px] h-[400px] rounded-full overflow-hidden mx-auto bg-transparent shadow-lg">
      <Canvas
        
        camera={{ position: [0, 0, 12], fov: 35 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }} 
      >
        
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.3} />
        <pointLight position={[20, 20, 20]} intensity={1} />
        <pointLight position={[-20, -20, -20]} intensity={0.5} />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow
        />

        <Globe plants={plants} />
        
        {/* Add orbit controls for user interaction */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
          minDistance={8}
          maxDistance={25}
        />
      </Canvas>
    </div>
  );
} 