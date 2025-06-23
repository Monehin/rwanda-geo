/**
 * Core interface for all geographical units in Rwanda
 */
export interface GeoUnit {
  id: number;
  code: string;
  name: string;
  slug: string;
  shortCode: string;
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
  code: string; // Format: RW-XX (e.g., RW-01 for Kigali)
}

/**
 * District-level administrative unit
 */
export interface District extends GeoUnit {
  code: string; // Format: RW-D-XX (e.g., RW-D-01 for Gasabo)
  parentCode: string; // Province code
}

/**
 * Sector-level administrative unit
 */
export interface Sector extends GeoUnit {
  code: string; // Format: RW-S-XXX (e.g., RW-S-001 for Bumbogo)
  parentCode: string; // District code
}

/**
 * Cell-level administrative unit
 */
export interface Cell extends GeoUnit {
  code: string; // Format: RW-C-XXXX (e.g., RW-C-0001 for Bumbogo cell)
  parentCode: string; // Sector code
}

/**
 * Village-level administrative unit
 */
export interface Village extends GeoUnit {
  code: string; // Format: RW-V-XXXXX (e.g., RW-V-00001 for Bumbogo village)
  parentCode: string; // Cell code
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