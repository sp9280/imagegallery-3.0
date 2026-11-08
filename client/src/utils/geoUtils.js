// client/src/utils/geoUtils.js

/**
 * Fast offline reverse-geocoding lookup for coordinates
 * Provides named location fallback alongside raw coordinates (e.g. 22.6331°, 88.3545° -> Belgharia / Kolkata, West Bengal, India)
 */
const REGIONS = [
  // West Bengal / Kolkata / Howrah / Hooghly region
  { latMin: 22.50, latMax: 22.75, lonMin: 88.25, lonMax: 88.50, name: "Belgharia / Greater Kolkata, West Bengal, India" },
  { latMin: 22.30, latMax: 22.80, lonMin: 88.10, lonMax: 88.60, name: "Kolkata Metropolitan Area, West Bengal, India" },
  { latMin: 21.50, latMax: 27.50, lonMin: 85.50, lonMax: 89.90, name: "West Bengal, India" },

  // Major Indian Tech & Metro Hubs
  { latMin: 28.30, latMax: 28.90, lonMin: 76.80, lonMax: 77.40, name: "New Delhi & NCR, India" },
  { latMin: 18.80, latMax: 19.35, lonMin: 72.70, lonMax: 73.15, name: "Mumbai, Maharashtra, India" },
  { latMin: 12.80, latMax: 13.20, lonMin: 77.40, lonMax: 77.80, name: "Bengaluru, Karnataka, India" },
  { latMin: 17.20, latMax: 17.60, lonMin: 78.20, lonMax: 78.65, name: "Hyderabad, Telangana, India" },
  { latMin: 12.90, latMax: 13.25, lonMin: 80.10, lonMax: 80.35, name: "Chennai, Tamil Nadu, India" },
  { latMin: 18.40, latMax: 18.70, lonMin: 73.70, lonMax: 74.05, name: "Pune, Maharashtra, India" },

  // Global Metros & Landmark Regions
  { latMin: 40.50, latMax: 40.95, lonMin: -74.25, lonMax: -73.70, name: "New York City, NY, USA" },
  { latMin: 37.60, latMax: 37.90, lonMin: -122.55, lonMax: -122.35, name: "San Francisco, CA, USA" },
  { latMin: 33.90, latMax: 34.20, lonMin: -118.50, lonMax: -118.15, name: "Los Angeles, CA, USA" },
  { latMin: 51.30, latMax: 51.70, lonMin: -0.50, lonMax: 0.30, name: "London, United Kingdom" },
  { latMin: 48.75, latMax: 48.95, lonMin: 2.15, lonMax: 2.50, name: "Paris, Île-de-France, France" },
  { latMin: 35.50, latMax: 35.85, lonMin: 139.50, lonMax: 140.00, name: "Tokyo, Kanto, Japan" },
  { latMin: 1.20, latMax: 1.50, lonMin: 103.60, lonMax: 104.05, name: "Singapore" },
  { latMin: 25.00, latMax: 25.35, lonMin: 55.10, lonMax: 55.45, name: "Dubai, United Arab Emirates" },
  { latMin: -33.95, latMax: -33.70, lonMin: 151.00, lonMax: 151.35, name: "Sydney, NSW, Australia" },
  { latMin: 52.40, latMax: 52.60, lonMin: 13.25, lonMax: 13.60, name: "Berlin, Germany" }
];

/**
 * Get human-readable named location alongside coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} Formatted location with place name and coordinates
 */
export const formatCoordinatesWithPlace = (lat, lon) => {
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;

  const coordStr = `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;

  const match = REGIONS.find(
    r => lat >= r.latMin && lat <= r.latMax && lon >= r.lonMin && lon <= r.lonMax
  );

  if (match) {
    return `${match.name} (${coordStr})`;
  }

  return coordStr;
};

/**
 * Parse coordinate string like "22.6331°, 88.3545°" and augment with place name if needed
 * @param {string} locationStr
 * @returns {string}
 */
export const augmentLocationString = (locationStr) => {
  if (!locationStr) return "";

  // If already contains place name beyond coords
  if (/[a-zA-Z]/.test(locationStr) && !locationStr.includes("°")) {
    return locationStr;
  }

  const match = locationStr.match(/(-?\d+(?:\.\d+)?)\s*°?\s*,\s*(-?\d+(?:\.\d+)?)\s*°?/);
  if (match) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lon)) {
      return formatCoordinatesWithPlace(lat, lon);
    }
  }

  return locationStr;
};

