import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, DoubleSide } from 'three';
import { PLANETS } from '../constants';
import { CelestialType, CelestialBody } from '../types';
import { Text, Billboard } from '@react-three/drei';

interface SolarSystemProps {
  onSelect: (body: CelestialBody) => void;
}

const Sun = ({ onSelect }: { onSelect: (b: CelestialBody) => void }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const handleSelect = () => {
    onSelect({
      id: 'sun',
      name: 'The Sun',
      cnName: '太阳',
      type: CelestialType.SUN,
      position: new Vector3(0,0,0),
      radius: 8,
      color: '#FDB813',
      description: 'The star at the center of our Solar System.'
    });
  };

  return (
    <group onClick={(e) => { e.stopPropagation(); handleSelect(); }}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial 
          emissive="#FDB813" 
          emissiveIntensity={2} 
          color="#FDB813" 
        />
      </mesh>
      <pointLight distance={300} intensity={2} decay={1} color="#ffffff" />
      <mesh scale={[1.05, 1.05, 1.05]}>
         <sphereGeometry args={[4, 32, 32]} />
         <meshBasicMaterial color="#FDB813" transparent opacity={0.3} side={DoubleSide} />
      </mesh>
    </group>
  );
};

const Planet: React.FC<{ data: typeof PLANETS[0], onSelect: (b: CelestialBody) => void }> = ({ data, onSelect }) => {
  const meshRef = useRef<Mesh>(null);
  const orbitRef = useRef<Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    // Animate Orbit
    angleRef.current += data.orbitSpeed * delta * 10; // Speed up for visual
    const x = Math.cos(angleRef.current) * data.orbitRadius;
    const z = Math.sin(angleRef.current) * data.orbitRadius;
    
    if (meshRef.current) {
      meshRef.current.position.set(x, 0, z);
      meshRef.current.rotation.y += 0.01;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Clone position to avoid referencing moving object directly in static UI state
    const currentPos = meshRef.current ? meshRef.current.position.clone() : data.position;
    onSelect({ ...data, position: currentPos });
  };

  return (
    <group>
      {/* Orbit Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.orbitRadius - 0.1, data.orbitRadius + 0.1, 64]} />
        <meshBasicMaterial color={data.orbitColor} opacity={0.3} transparent side={DoubleSide} />
      </mesh>

      {/* Planet Body */}
      <mesh 
        ref={meshRef} 
        onClick={handleClick}
        position={data.position}
      >
        <sphereGeometry args={[data.radius, 32, 32]} />
        <meshStandardMaterial color={data.color} />
        
        {/* Label visible on hover/always? Let's keep it clean, maybe only on hover. 
            For now, just the mesh. */}
      </mesh>
    </group>
  );
};

export const SolarSystem: React.FC<SolarSystemProps> = ({ onSelect }) => {
  return (
    <group>
      <Sun onSelect={onSelect} />
      {PLANETS.map((planet) => (
        <Planet key={planet.id} data={planet} onSelect={onSelect} />
      ))}
    </group>
  );
};