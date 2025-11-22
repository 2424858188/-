import React, { useMemo, useState } from 'react';
import { Instance, Instances, Line } from '@react-three/drei';
import { Vector3, AdditiveBlending } from 'three';
import { generateStarField } from '../services/astronomyService';
import { CelestialBody, StarData, Asterism } from '../types';
import { ASTERISMS } from '../constants';

interface StarFieldProps {
  onSelect: (star: CelestialBody) => void;
  showConstellations: boolean;
  highlightAsterism: string | null;
}

export const StarField: React.FC<StarFieldProps> = ({ onSelect, showConstellations, highlightAsterism }) => {
  const stars = useMemo(() => generateStarField(3000, 450), []);
  
  // Mapping for asterism lines
  const starMap = useMemo(() => {
    const map = new Map<string, Vector3>();
    stars.forEach(s => map.set(s.id, s.position));
    return map;
  }, [stars]);

  const getAsterismLines = () => {
    if (!showConstellations && !highlightAsterism) return [];

    const lines: React.ReactElement[] = [];
    
    ASTERISMS.forEach((ast, idx) => {
        if (highlightAsterism && highlightAsterism !== ast.name) return;
        
        // Simple closed loop or line strip for demo
        // In a real app, this needs explicit pairs
        const points: Vector3[] = [];
        ast.starIds.forEach(id => {
            const pos = starMap.get(id);
            if (pos) points.push(pos);
        });

        if (points.length > 1) {
            lines.push(
                <Line
                    key={`ast-${idx}`}
                    points={points}
                    color={highlightAsterism === ast.name ? "#00ffff" : "#ffffff"}
                    opacity={highlightAsterism === ast.name ? 0.8 : 0.15}
                    transparent
                    lineWidth={highlightAsterism === ast.name ? 3 : 1}
                />
            );
        }
    });
    return lines;
  };

  return (
    <group>
      {/* Render individual interactive stars */}
      <Instances range={stars.length}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.8} blending={AdditiveBlending} />
        
        {stars.map((star, i) => (
          <Instance
            key={i}
            position={star.position}
            scale={star.radius}
            color={star.color}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(star);
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
                 document.body.style.cursor = 'auto';
            }}
          />
        ))}
      </Instances>

      {/* North Star Highlight (Axis) */}
      {showConstellations && (
         <Line 
            points={[new Vector3(0,0,0), new Vector3(0, 450, 0)]} 
            color="#4444ff" 
            opacity={0.2} 
            transparent 
            dashed
         />
      )}

      {getAsterismLines()}
    </group>
  );
};