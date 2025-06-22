/**
 * Core interface for all geographical units in Rwanda
 */
export interface GeoUnit {
  code: string;
  name: string;
  slug: string;
  parentCode?: string;
  center?: {
    lat: number;
    lng: number;
  };
}

/**
 * Province-level administrative unit
 */
export interface Province extends GeoUnit {
  code: string; // Format: RW-XX (e.g., RW-KG for Kigali)
}

/**
 * District-level administrative unit
 */
export interface District extends GeoUnit {
  code: string; // Format: RW-XX-YY (e.g., RW-KG-GAS for Gasabo)
  parentCode: string; // Province code
}

/**
 * Sector-level administrative unit
 */
export interface Sector extends GeoUnit {
  code: string; // Format: RW-XX-YY-ZZ
  parentCode: string; // District code
}

/**
 * Cell-level administrative unit
 */
export interface Cell extends GeoUnit {
  code: string; // Format: RW-XX-YY-ZZ-AA
  parentCode: string; // Sector code
}

/**
 * Village-level administrative unit
 */
export interface Village extends GeoUnit {
  code: string; // Format: RW-XX-YY-ZZ-AA-BB
  parentCode: string; // Cell code
  shortCode: string; // Short numeric code for villages
}

/**
 * Union type for all administrative levels
 */
export type AdministrativeUnit = Province | District | Sector | Cell | Village;

/**
 * Administrative level enumeration
 */
export enum AdminLevel {
  PROVINCE = 'province',
  DISTRICT = 'district',
  SECTOR = 'sector',
  CELL = 'cell',
  VILLAGE = 'village',
}

/**
 * GeoJSON Feature properties interface
 */
export interface GeoJSONProperties {
  code: string;
  name: string;
  slug: string;
  parentCode?: string;
  level: AdminLevel;
}

/**
 * GeoJSON Feature interface
 */
export interface GeoJSONFeature {
  type: 'Feature';
  properties: GeoJSONProperties;
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

/**
 * GeoJSON FeatureCollection interface
 */
export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
} 