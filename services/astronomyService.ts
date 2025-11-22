import { Vector3 } from 'three';
import { FAMOUS_STARS, SPECTRAL_COLORS } from '../constants';
import { CelestialType, StarData } from '../types';

// Convert Right Ascension (Hours) and Declination (Degrees) to Cartesian Coordinates
// Radius is the distance from center (Earth/Sun) to the star on the celestial sphere
export const raDecToVector3 = (ra: number, dec: number, radius: number): Vector3 => {
  // Convert to radians
  const phi = (90 - dec) * (Math.PI / 180); // Polar angle (from Y axis)
  // RA is in hours (0-24), convert to degrees then radians. 
  // 24h = 360deg -> 1h = 15deg.
  // We adjust phase so 0h is roughly +X or +Z depending on convention. Let's use standard math spherical.
  const theta = (ra * 15) * (Math.PI / 180); // Azimuthal angle (in X-Z plane)

  // Spherical to Cartesian (Y-up convention in Three.js)
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi); // Dec controls Y height
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
};

const randomSpectralClass = (): string => {
  const rand = Math.random();
  if (rand > 0.97) return 'O';
  if (rand > 0.90) return 'B';
  if (rand > 0.80) return 'A';
  if (rand > 0.70) return 'F';
  if (rand > 0.50) return 'G';
  if (rand > 0.20) return 'K';
  return 'M'; // M dwarfs are most common
};

// Generate dataset
export const generateStarField = (count: number = 3000, baseRadius: number = 400): StarData[] => {
  const stars: StarData[] = [];

  // 1. Add Famous Stars first
  // We keep famous stars relatively fixed on the inner sphere for projection accuracy
  FAMOUS_STARS.forEach((fs) => {
    const pos = raDecToVector3(fs.ra, fs.dec, baseRadius);
    stars.push({
      ...fs,
      position: pos,
      radius: 2.5, // Slightly larger for visibility
      color: SPECTRAL_COLORS[fs.spectralClass || 'G'],
      type: CelestialType.STAR,
    });
  });

  // 2. Generate Background Stars with Volumetric Depth
  for (let i = 0; i < count; i++) {
    // Random distribution on a sphere
    // Use acos for uniform distribution on sphere surface to avoid bunching at poles
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u; // Azimuth
    const phi = Math.acos(2 * v - 1); // Polar angle

    // Volumetric variation: Create a thick shell/cloud instead of a thin sphere
    // Range from baseRadius to baseRadius * 1.8
    const radiusVariation = baseRadius + (Math.random() * baseRadius * 0.8);

    const x = radiusVariation * Math.sin(phi) * Math.cos(theta);
    const y = radiusVariation * Math.sin(phi) * Math.sin(theta); // Corrected math: standard spherical Y is usually up
    const z = radiusVariation * Math.cos(phi);

    // Note: In three.js standard, Y is up. 
    // Previous implementation might have swapped axes. 
    // Let's stick to standard math: x=r*sin(phi)cos(theta), z=r*sin(phi)sin(theta), y=r*cos(phi)
    // But to match "galaxy plane" usually being X-Z, we flatten Y. 
    // Let's just use the calculated vector.
    
    const posVector = new Vector3(x, radiusVariation * Math.cos(phi), radiusVariation * Math.sin(phi) * Math.sin(theta));

    // Determine random properties
    const spectral = randomSpectralClass();
    const magnitude = 2 + Math.random() * 4; // Mag 2 to 6
    
    // Calculate basic RA/Dec for data completeness (approximate)
    const ra = (theta * 12) / Math.PI;
    const dec = 90 - (phi * 180 / Math.PI);

    stars.push({
      id: `star-${i}`,
      name: `HIP ${Math.floor(Math.random() * 100000)}`,
      cnName: '',
      type: CelestialType.STAR,
      position: posVector, 
      radius: Math.max(0.4, (7 - magnitude) * 0.4), // Slightly scaled up for distant viewing
      color: SPECTRAL_COLORS[spectral],
      spectralClass: spectral,
      magnitude: parseFloat(magnitude.toFixed(2)),
      distance: Math.floor(radiusVariation + Math.random() * 500), // Correlate distance with visual depth roughly
      ra,
      dec,
    });
  }

  return stars;
};