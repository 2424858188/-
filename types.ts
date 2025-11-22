import { Vector3 } from 'three';

export enum CelestialType {
  STAR = 'STAR',
  PLANET = 'PLANET',
  SUN = 'SUN'
}

export interface CelestialBody {
  id: string;
  name: string; // English / Latin
  cnName: string; // Chinese
  type: CelestialType;
  position: Vector3;
  radius: number; // For display scale
  color: string;
  
  // Scientific Data
  distance?: number; // Light years (stars) or AU (planets)
  magnitude?: number; // Apparent magnitude
  spectralClass?: string; // O, B, A, F, G, K, M
  constellation?: string;
  description?: string; // Short static description
  
  // Orbital info (Planets only)
  orbitRadius?: number;
  orbitSpeed?: number;
}

export interface StarData extends CelestialBody {
  type: CelestialType.STAR;
  ra: number; // Right Ascension
  dec: number; // Declination
}

export interface PlanetData extends CelestialBody {
  type: CelestialType.PLANET;
  orbitColor: string;
}

export interface ConstellationLine {
  startId: string;
  endId: string;
  constellationName: string;
}

export interface Asterism {
  name: string;
  starIds: string[];
}

export interface GeminiInfo {
  description: string;
  funFact: string;
  scienceNote: string;
}
