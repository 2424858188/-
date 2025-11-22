import { Vector3 } from 'three';
import { CelestialType, PlanetData, StarData, ConstellationLine, Asterism } from './types';

// Spectral Colors (Kelvin approximation)
export const SPECTRAL_COLORS: Record<string, string> = {
  O: '#9bb0ff', // Blue-violet
  B: '#aabfff', // Blue-white
  A: '#cad7ff', // White
  F: '#f8f7ff', // Yellow-white
  G: '#fff4ea', // Yellow (Sun)
  K: '#ffd2a1', // Orange
  M: '#ffcc6f', // Red-Orange
  UNKNOWN: '#ffffff'
};

// Solar System Data (Scale is stylized: Distances compressed, sizes exaggerated for visibility)
export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    cnName: '水星',
    type: CelestialType.PLANET,
    position: new Vector3(10, 0, 0),
    radius: 0.8,
    color: '#A5A5A5',
    orbitRadius: 10,
    orbitSpeed: 0.04,
    orbitColor: '#444',
    distance: 0.39,
    description: 'The smallest planet in our solar system and closest to the Sun.'
  },
  {
    id: 'venus',
    name: 'Venus',
    cnName: '金星',
    type: CelestialType.PLANET,
    position: new Vector3(15, 0, 0),
    radius: 1.5,
    color: '#E3BB76',
    orbitRadius: 15,
    orbitSpeed: 0.03,
    orbitColor: '#554',
    distance: 0.72,
    description: 'Second planet from the Sun. It has a thick atmosphere trapping heat.'
  },
  {
    id: 'earth',
    name: 'Earth',
    cnName: '地球',
    type: CelestialType.PLANET,
    position: new Vector3(22, 0, 0),
    radius: 1.6,
    color: '#4F86F7',
    orbitRadius: 22,
    orbitSpeed: 0.02,
    orbitColor: '#345',
    distance: 1.0,
    description: 'Our home planet, the only known celestial body to support life.'
  },
  {
    id: 'mars',
    name: 'Mars',
    cnName: '火星',
    type: CelestialType.PLANET,
    position: new Vector3(30, 0, 0),
    radius: 1.1,
    color: '#E27B58',
    orbitRadius: 30,
    orbitSpeed: 0.016,
    orbitColor: '#533',
    distance: 1.52,
    description: 'The Red Planet, known for its iron oxide dust and potential for past life.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    cnName: '木星',
    type: CelestialType.PLANET,
    position: new Vector3(50, 0, 0),
    radius: 4.5,
    color: '#C99039',
    orbitRadius: 50,
    orbitSpeed: 0.008,
    orbitColor: '#543',
    distance: 5.2,
    description: 'The largest planet in our solar system, a gas giant with a Great Red Spot.'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    cnName: '土星',
    type: CelestialType.PLANET,
    position: new Vector3(70, 0, 0),
    radius: 3.8,
    color: '#E3E0C0',
    orbitRadius: 70,
    orbitSpeed: 0.006,
    orbitColor: '#554',
    distance: 9.58,
    description: 'Famous for its distinct ring system, composed mainly of ice particles.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    cnName: '天王星',
    type: CelestialType.PLANET,
    position: new Vector3(90, 0, 0),
    radius: 2.5,
    color: '#D1F3F9',
    orbitRadius: 90,
    orbitSpeed: 0.004,
    orbitColor: '#344',
    distance: 19.2,
    description: 'An ice giant that rotates on its side, likely due to a massive collision.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    cnName: '海王星',
    type: CelestialType.PLANET,
    position: new Vector3(110, 0, 0),
    radius: 2.4,
    color: '#3E54E8',
    orbitRadius: 110,
    orbitSpeed: 0.003,
    orbitColor: '#335',
    distance: 30.07,
    description: 'The most distant planet, a dark, cold, and windy ice giant.'
  }
];

// Hardcoded Famous Stars to ensure they appear correct relative to Earth
// RA is in hours (0-24), Dec in degrees (-90 to +90)
// Distance in Light Years
export const FAMOUS_STARS: Omit<StarData, 'position' | 'color' | 'radius'>[] = [
  { id: 'polaris', name: 'Polaris', cnName: '勾陈一 (北极星)', type: CelestialType.STAR, ra: 2.53, dec: 89.26, magnitude: 1.97, distance: 433, spectralClass: 'F', constellation: 'Ursa Minor' },
  { id: 'sirius', name: 'Sirius', cnName: '天狼星', type: CelestialType.STAR, ra: 6.75, dec: -16.71, magnitude: -1.46, distance: 8.6, spectralClass: 'A', constellation: 'Canis Major' },
  { id: 'betelgeuse', name: 'Betelgeuse', cnName: '参宿四', type: CelestialType.STAR, ra: 5.92, dec: 7.4, magnitude: 0.42, distance: 642, spectralClass: 'M', constellation: 'Orion' },
  { id: 'rigel', name: 'Rigel', cnName: '参宿七', type: CelestialType.STAR, ra: 5.24, dec: -8.2, magnitude: 0.12, distance: 860, spectralClass: 'B', constellation: 'Orion' },
  { id: 'aldebaran', name: 'Aldebaran', cnName: '毕宿五', type: CelestialType.STAR, ra: 4.6, dec: 16.5, magnitude: 0.85, distance: 65, spectralClass: 'K', constellation: 'Taurus' },
  { id: 'antares', name: 'Antares', cnName: '心宿二', type: CelestialType.STAR, ra: 16.48, dec: -26.43, magnitude: 0.96, distance: 550, spectralClass: 'M', constellation: 'Scorpius' },
  { id: 'vega', name: 'Vega', cnName: '织女一', type: CelestialType.STAR, ra: 18.62, dec: 38.78, magnitude: 0.03, distance: 25, spectralClass: 'A', constellation: 'Lyra' },
  { id: 'altair', name: 'Altair', cnName: '河鼓二 (牛郎星)', type: CelestialType.STAR, ra: 19.85, dec: 8.87, magnitude: 0.77, distance: 16.7, spectralClass: 'A', constellation: 'Aquila' },
  { id: 'deneb', name: 'Deneb', cnName: '天津四', type: CelestialType.STAR, ra: 20.69, dec: 45.28, magnitude: 1.25, distance: 2600, spectralClass: 'A', constellation: 'Cygnus' },
];

// Constellation Connections (Simplified)
export const ASTERISMS: Asterism[] = [
  { name: 'Orion Belt', starIds: ['betelgeuse', 'rigel'] }, // Simplified connection for demo
  { name: 'Summer Triangle', starIds: ['vega', 'altair', 'deneb'] }
];
