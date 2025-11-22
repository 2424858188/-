import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { SolarSystem } from './components/SolarSystem';
import { StarField } from './components/StarField';
import { UIOverlay } from './components/UIOverlay';
import { CelestialBody } from './types';
import { PLANETS, FAMOUS_STARS } from './constants';
import { Vector3 } from 'three';
import { raDecToVector3 } from './services/astronomyService';

const App: React.FC = () => {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [showConstellations, setShowConstellations] = useState(true);
  const [highlightAsterism, setHighlightAsterism] = useState<string | null>(null);
  const cameraControlRef = useRef<any>(null);

  const handleSelect = (body: CelestialBody) => {
    setSelectedBody(body);
    // Optional: Animate camera to look at selection
    // For now, we keep orbit controls free for user freedom
  };

  const handleSearch = (name: string) => {
    // Find in Planets
    const planet = PLANETS.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (planet) {
      handleSelect(planet);
      if (cameraControlRef.current) {
        // Simplified zoom to planet logic
        // In a real app, we would interpolate the camera position
      }
      return;
    }

    // Find in Famous Stars
    const starInfo = FAMOUS_STARS.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (starInfo) {
      // Reconstruct full star data object (position calculation repeated for simplicity)
      // In prod, cache this map
      const pos = raDecToVector3(starInfo.ra, starInfo.dec, 450);
      const fullStar: CelestialBody = {
          ...starInfo,
          position: pos,
          radius: 2.5,
          color: '#ffffff' // Default fallback, visual layer handles actual color
      };
      handleSelect(fullStar);
    }
  };

  const resetCamera = () => {
    setSelectedBody(null);
    if(cameraControlRef.current) {
        cameraControlRef.current.reset();
    }
  };

  return (
    <div className="w-full h-full relative bg-black">
      {/* 3D Scene */}
      <Canvas>
        <PerspectiveCamera makeDefault position={[50, 30, 80]} fov={60} far={10000} />
        <OrbitControls 
            ref={cameraControlRef}
            enablePan={true} 
            enableZoom={true} 
            maxDistance={4000}
            minDistance={5}
            autoRotate={!selectedBody}
            autoRotateSpeed={0.3}
        />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffddaa" />

        <Suspense fallback={null}>
           {/* Background aesthetic stars (faint distant dust) - pushed far back */}
           <Stars radius={3000} depth={500} count={5000} factor={4} saturation={0} fade speed={1} />
           
           {/* Main Visualizations */}
           <SolarSystem onSelect={handleSelect} />
           <StarField 
             onSelect={handleSelect} 
             showConstellations={showConstellations}
             highlightAsterism={highlightAsterism}
           />
        </Suspense>
      </Canvas>

      {/* UI Layer */}
      <UIOverlay 
        selectedBody={selectedBody}
        onCloseInfo={() => setSelectedBody(null)}
        onSearch={handleSearch}
        onToggleConstellations={() => setShowConstellations(!showConstellations)}
        showConstellations={showConstellations}
        onResetCamera={resetCamera}
      />
    </div>
  );
};

export default App;