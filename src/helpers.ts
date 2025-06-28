import { lazyLoadGzippedJson } from './utils/lazy-loader';
import { Province, District, Sector, Cell, Village, AdministrativeUnit } from './types';

// Language mapping for province names (English to Kinyarwanda)
const PROVINCE_LANGUAGE_MAP = {
  'Kigali City': {
    en: 'Kigali City',
    rw: 'Umujyi wa Kigali'
  },
  'Southern Province': {
    en: 'Southern Province',
    rw: 'Amajyepfo'
  },
  'Western Province': {
    en: 'Western Province',
    rw: 'Iburengerazuba'
  },
  'Northern Province': {
    en: 'Northern Province',
    rw: 'Amajyaruguru'
  },
  'Eastern Province': {
    en: 'Eastern Province',
    rw: 'Iburasirazuba'
  }
};

// Language mapping for province slugs
const PROVINCE_SLUG_MAP = {
  'Kigali City': {
    en: 'kigali-city',
    rw: 'umujyi-wa-kigali'
  },
  'Southern Province': {
    en: 'southern-province',
    rw: 'amajyepfo'
  },
  'Western Province': {
    en: 'western-province',
    rw: 'iburengerazuba'
  },
  'Northern Province': {
    en: 'northern-province',
    rw: 'amajyaruguru'
  },
  'Eastern Province': {
    en: 'eastern-province',
    rw: 'iburasirazuba'
  }
};

// Helper function to get translated province name
function getTranslatedProvinceName(originalName: string, language: 'en' | 'rw' = 'en'): string {
  const mapping = PROVINCE_LANGUAGE_MAP[originalName as keyof typeof PROVINCE_LANGUAGE_MAP];
  return mapping ? mapping[language] : originalName;
}

// Helper function to get translated province slug
function getTranslatedProvinceSlug(originalName: string, language: 'en' | 'rw' = 'en'): string {
  const mapping = PROVINCE_SLUG_MAP[originalName as keyof typeof PROVINCE_SLUG_MAP];
  return mapping ? mapping[language] : originalName.toLowerCase().replace(/\s+/g, '-');
}

// Lazy-loaded data accessors
function getProvincesData(): Province[] {
  return lazyLoadGzippedJson<Province[]>('provinces');
}

function getDistrictsData(): District[] {
  return lazyLoadGzippedJson<District[]>('districts');
}

function getSectorsData(): Sector[] {
  return lazyLoadGzippedJson<Sector[]>('sectors');
}

function getCellsData(): Cell[] {
  return lazyLoadGzippedJson<Cell[]>('cells');
}

function getVillagesData(): Village[] {
  return lazyLoadGzippedJson<Village[]>('villages');
}

// Lazy-loaded lookup map
let allUnitsMap: Map<string, AdministrativeUnit> | null = null;

function getAllUnitsMap(): Map<string, AdministrativeUnit> {
  if (!allUnitsMap) {
    allUnitsMap = new Map<string, AdministrativeUnit>();
    
    // Load and populate the map - handle missing files gracefully
    try {
      getProvincesData().forEach(province => allUnitsMap!.set(province.code, province));
    } catch (error) {
      console.warn('Warning: Could not load provinces data:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    try {
      getDistrictsData().forEach(district => allUnitsMap!.set(district.code, district));
    } catch (error) {
      console.warn('Warning: Could not load districts data:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    try {
      getSectorsData().forEach(sector => allUnitsMap!.set(sector.code, sector));
    } catch (error) {
      console.warn('Warning: Could not load sectors data:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    try {
      getCellsData().forEach(cell => allUnitsMap!.set(cell.code, cell));
    } catch (error) {
      console.warn('Warning: Could not load cells data:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    try {
      getVillagesData().forEach(village => allUnitsMap!.set(village.code, village));
    } catch (error) {
      console.warn('Warning: Could not load villages data:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
  return allUnitsMap;
}

/**
 * Get all provinces in Rwanda
 * @param options - Optional parameters including language preference
 * @returns Array of all provinces
 */
export function getAllProvinces(options?: { language?: 'en' | 'rw' }): Province[] {
  try {
    const provinces = getProvincesData();
    const language = options?.language || 'en';
    
    // If English is requested and we have English names, return as is
    if (language === 'en') {
      return [...provinces];
    }
    
    // If Kinyarwanda is requested, translate the names
    if (language === 'rw') {
      return provinces.map(province => ({
        ...province,
        name: getTranslatedProvinceName(province.name, 'rw'),
        slug: getTranslatedProvinceSlug(province.name, 'rw')
      }));
    }
    
    return [...provinces];
  } catch (error) {
    console.warn('Warning: Could not load provinces data:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Get all districts in Rwanda
 * @returns Array of all districts
 */
export function getAllDistricts(): District[] {
  try {
    return [...getDistrictsData()];
  } catch (error) {
    console.warn('Warning: Could not load districts data:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Get all sectors in Rwanda
 * @returns Array of all sectors
 */
export function getAllSectors(): Sector[] {
  try {
    return [...getSectorsData()];
  } catch (error) {
    console.warn('Warning: Could not load sectors data:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Get all cells in Rwanda
 * @returns Array of all cells
 */
export function getAllCells(): Cell[] {
  try {
    return [...getCellsData()];
  } catch (error) {
    console.warn('Warning: Could not load cells data:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Get all villages in Rwanda
 * @returns Array of all villages
 */
export function getAllVillages(): Village[] {
  try {
    return [...getVillagesData()];
  } catch (error) {
    console.warn('Warning: Could not load villages data:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Get districts by province code
 * @param provinceCode - The province code (e.g., 'RW-01')
 * @returns Array of districts in the specified province
 */
export function getDistrictsByProvince(provinceCode: string): District[] {
  return getDistrictsData().filter(district => district.parentCode === provinceCode);
}

/**
 * Get sectors by district code
 * @param districtCode - The district code (e.g., 'RW-D-01')
 * @returns Array of sectors in the specified district
 */
export function getSectorsByDistrict(districtCode: string): Sector[] {
  return getSectorsData().filter(sector => sector.parentCode === districtCode);
}

/**
 * Get cells by sector code
 * @param sectorCode - The sector code (e.g., 'RW-S-001')
 * @returns Array of cells in the specified sector
 */
export function getCellsBySector(sectorCode: string): Cell[] {
  return getCellsData().filter(cell => cell.parentCode === sectorCode);
}

/**
 * Get villages by cell code
 * @param cellCode - The cell code (e.g., 'RW-C-0001')
 * @returns Array of villages in the specified cell
 */
export function getVillagesByCell(cellCode: string): Village[] {
  return getVillagesData().filter(village => village.parentCode === cellCode);
}

/**
 * Get a geographical unit by its code
 * @param code - The unique code of the unit
 * @returns The geographical unit or undefined if not found
 */
export function getByCode(code: string): AdministrativeUnit | undefined {
  return getAllUnitsMap().get(code);
}

/**
 * Get the complete hierarchy chain for a given code
 * @param code - The code of the unit to get hierarchy for
 * @returns Array of units from root (province) to the specified unit
 */
export function getHierarchy(code: string): AdministrativeUnit[] {
  const unit = getByCode(code);
  if (!unit) {
    return [];
  }

  const hierarchy: AdministrativeUnit[] = [unit];
  let currentUnit = unit;

  // Traverse up the hierarchy until we reach a province (no parentCode)
  while (currentUnit.parentCode) {
    const parent = getByCode(currentUnit.parentCode);
    if (parent) {
      hierarchy.unshift(parent);
      currentUnit = parent;
    } else {
      break;
    }
  }

  return hierarchy;
}

/**
 * Get all children of a given unit
 * @param parentCode - The parent unit code
 * @returns Array of child units
 */
export function getChildren(parentCode: string): AdministrativeUnit[] {
  return Array.from(getAllUnitsMap().values()).filter(unit => unit.parentCode === parentCode);
}

/**
 * Search for units by name (case-insensitive)
 * @param name - The name to search for
 * @returns Array of units matching the name
 */
export function searchByName(name: string): AdministrativeUnit[] {
  const searchTerm = name.toLowerCase();
  return Array.from(getAllUnitsMap().values()).filter(unit => 
    unit.name.toLowerCase().includes(searchTerm)
  );
}

/**
 * Search for units by slug (case-insensitive)
 * @param slug - The slug to search for
 * @returns Array of units matching the slug
 */
export function searchBySlug(slug: string): AdministrativeUnit[] {
  const searchTerm = slug.toLowerCase();
  return Array.from(getAllUnitsMap().values()).filter(unit => 
    unit.slug.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get all units at a specific administrative level
 * @param level - The administrative level to filter by
 * @returns Array of units at the specified level
 */
export function getByLevel(level: 'province' | 'district' | 'sector' | 'cell' | 'village'): AdministrativeUnit[] {
  switch (level) {
    case 'province':
      return getAllProvinces();
    case 'district':
      return getAllDistricts();
    case 'sector':
      return getAllSectors();
    case 'cell':
      return getAllCells();
    case 'village':
      return getAllVillages();
    default:
      return [];
  }
}

/**
 * Get the total count of units at each administrative level
 * @returns Object with counts for each level
 */
export function getCounts() {
  const provinces = getProvincesData();
  const districts = getDistrictsData();
  const sectors = getSectorsData();
  const cells = getCellsData();
  const villages = getVillagesData();
  
  return {
    provinces: provinces.length,
    districts: districts.length,
    sectors: sectors.length,
    cells: cells.length,
    villages: villages.length,
    total: provinces.length + districts.length + sectors.length + cells.length + villages.length
  };
}

/**
 * Check if a code is valid
 * @param code - The code to validate
 * @returns True if the code is valid
 */
export function isValidCode(code: string): boolean {
  return getAllUnitsMap().has(code);
}

/**
 * Get the administrative level of a code
 * @param code - The code to check
 * @returns The administrative level or undefined if invalid
 */
export function getCodeLevel(code: string): 'province' | 'district' | 'sector' | 'cell' | 'village' | undefined {
  if (!isValidCode(code)) return undefined;
  
  if (code.startsWith('RW-') && code.length === 5 && code.match(/^RW-\d{2}$/)) return 'province';
  if (code.startsWith('RW-D-')) return 'district';
  if (code.startsWith('RW-S-')) return 'sector';
  if (code.startsWith('RW-C-')) return 'cell';
  if (code.startsWith('RW-V-')) return 'village';
  
  return undefined;
}

/**
 * Get summary statistics
 * @returns Summary object with counts
 */
export function getSummary() {
  const provinces = getProvincesData();
  const districts = getDistrictsData();
  const sectors = getSectorsData();
  const cells = getCellsData();
  const villages = getVillagesData();
  
  return {
    provinces: provinces.length,
    districts: districts.length,
    sectors: sectors.length,
    cells: cells.length,
    villages: villages.length
  };
}

/**
 * Get the complete hierarchy chain for a given code
 * @param code - The code of the unit to get hierarchy for
 * @returns Array of units from root (province) to the specified unit
 */
export function getFullHierarchy(code: string): AdministrativeUnit[] {
  return getHierarchy(code);
}

/**
 * Get direct children of a given unit
 * @param parentCode - The parent unit code
 * @returns Array of child units
 */
export function getDirectChildren(parentCode: string): AdministrativeUnit[] {
  return getChildren(parentCode);
}

/**
 * Get siblings of a given unit
 * @param code - The unit code
 * @returns Array of sibling units
 */
export function getSiblings(code: string): AdministrativeUnit[] {
  const unit = getByCode(code);
  if (!unit || !unit.parentCode) return [];
  
  return getChildren(unit.parentCode).filter(sibling => sibling.code !== code);
}

/**
 * Get all descendants of a given unit
 * @param parentCode - The parent unit code
 * @returns Array of all descendant units
 */
export function getAllDescendants(parentCode: string): AdministrativeUnit[] {
  const descendants: AdministrativeUnit[] = [];
  const queue = [parentCode];
  
  while (queue.length > 0) {
    const currentCode = queue.shift()!;
    const children = getChildren(currentCode);
    
    children.forEach(child => {
      descendants.push(child);
      queue.push(child.code);
    });
  }
  
  return descendants;
}

// Advanced search and fuzzy matching functions
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Fuzzy search for units by name with scoring
 * @param query - The search query
 * @param threshold - Maximum distance for a match (default: 3)
 * @param limit - Maximum number of results (default: 10)
 * @returns Array of units with scores
 */
export function fuzzySearchByName(
  query: string, 
  threshold: number = 3, 
  limit: number = 10
): Array<{ unit: AdministrativeUnit; score: number }> {
  const searchTerm = query.toLowerCase();
  const results: Array<{ unit: AdministrativeUnit; score: number }> = [];
  
  getAllUnitsMap().forEach(unit => {
    const distance = levenshteinDistance(searchTerm, unit.name.toLowerCase());
    if (distance <= threshold) {
      results.push({ unit, score: 1 - (distance / Math.max(searchTerm.length, unit.name.length)) });
    }
  });
  
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Search for units by partial code
 * @param partialCode - The partial code to search for
 * @param limit - Maximum number of results (default: 20)
 * @returns Array of units matching the partial code
 */
export function searchByPartialCode(partialCode: string, limit: number = 20): AdministrativeUnit[] {
  const searchTerm = partialCode.toUpperCase();
  const results: AdministrativeUnit[] = [];
  
  getAllUnitsMap().forEach(unit => {
    if (unit.code.includes(searchTerm)) {
      results.push(unit);
    }
  });
  
  return results.slice(0, limit);
}

/**
 * Get smart suggestions for autocomplete
 * @param query - The search query
 * @param limit - Maximum number of suggestions (default: 10)
 * @returns Array of suggestions with match types
 */
export function getSuggestions(
  query: string, 
  limit: number = 10
): Array<{ 
  unit: AdministrativeUnit; 
  type: 'exact' | 'fuzzy' | 'partial'; 
  matchField: 'name' | 'code' | 'slug';
}> {
  const searchTerm = query.toLowerCase();
  const suggestions: Array<{ 
    unit: AdministrativeUnit; 
    type: 'exact' | 'fuzzy' | 'partial'; 
    matchField: 'name' | 'code' | 'slug';
  }> = [];
  
  getAllUnitsMap().forEach(unit => {
    // Check for exact matches
    if (unit.name.toLowerCase() === searchTerm) {
      suggestions.push({ unit, type: 'exact', matchField: 'name' });
    } else if (unit.code.toLowerCase() === searchTerm) {
      suggestions.push({ unit, type: 'exact', matchField: 'code' });
    } else if (unit.slug.toLowerCase() === searchTerm) {
      suggestions.push({ unit, type: 'exact', matchField: 'slug' });
    }
    // Check for partial matches
    else if (unit.name.toLowerCase().includes(searchTerm)) {
      suggestions.push({ unit, type: 'partial', matchField: 'name' });
    } else if (unit.code.toLowerCase().includes(searchTerm)) {
      suggestions.push({ unit, type: 'partial', matchField: 'code' });
    } else if (unit.slug.toLowerCase().includes(searchTerm)) {
      suggestions.push({ unit, type: 'partial', matchField: 'slug' });
    }
    // Check for fuzzy matches
    else {
      const nameDistance = levenshteinDistance(searchTerm, unit.name.toLowerCase());
      if (nameDistance <= 3) {
        suggestions.push({ unit, type: 'fuzzy', matchField: 'name' });
      }
    }
  });
  
  // Sort by type priority: exact > partial > fuzzy
  const typePriority = { exact: 3, partial: 2, fuzzy: 1 };
  return suggestions
    .sort((a, b) => {
      const priorityDiff = typePriority[b.type] - typePriority[a.type];
      if (priorityDiff !== 0) return priorityDiff;
      return a.unit.name.localeCompare(b.unit.name);
    })
    .slice(0, limit);
}

// Validation utility functions
/**
 * Validate parent-child relationship
 * @param parentCode - The parent unit code
 * @param childCode - The child unit code
 * @returns Validation result
 */
export function validateParentChildRelationship(
  parentCode: string, 
  childCode: string
): { 
  isValid: boolean; 
  error?: string; 
  parentLevel?: string; 
  childLevel?: string; 
} {
  const parent = getByCode(parentCode);
  const child = getByCode(childCode);
  
  if (!parent) {
    return { isValid: false, error: `Parent code '${parentCode}' not found` };
  }
  
  if (!child) {
    return { isValid: false, error: `Child code '${childCode}' not found` };
  }
  
  const parentLevel = getCodeLevel(parentCode);
  const childLevel = getCodeLevel(childCode);
  
  if (!parentLevel || !childLevel) {
    return { isValid: false, error: 'Invalid code format' };
  }
  
  // Check if child actually has this parent
  if (child.parentCode !== parentCode) {
    return { 
      isValid: false, 
      error: `Child '${childCode}' does not have parent '${parentCode}'`,
      parentLevel,
      childLevel
    };
  }
  
  return { isValid: true, parentLevel, childLevel };
}

/**
 * Validate code format
 * @param code - The code to validate
 * @returns Validation result
 */
export function validateCodeFormat(code: string): { 
  isValid: boolean; 
  error?: string; 
  level?: string; 
  format?: string; 
} {
  const level = getCodeLevel(code);
  
  if (!level) {
    return { 
      isValid: false, 
      error: 'Invalid code format',
      format: 'Expected: RW-XX, RW-D-XX, RW-S-XXX, RW-C-XXXX, or RW-V-XXXXX'
    };
  }
  
  return { isValid: true, level };
}

/**
 * Validate hierarchy integrity
 * @returns Validation result with issues
 */
export function validateHierarchyIntegrity(): {
  isValid: boolean;
  issues: Array<{
    type: 'orphaned' | 'invalid_parent' | 'circular_reference' | 'missing_unit';
    message: string;
    code?: string;
  }>;
  summary: {
    totalUnits: number;
    orphanedUnits: number;
    invalidParents: number;
    circularReferences: number;
    missingUnits: number;
  };
} {
  const issues: Array<{
    type: 'orphaned' | 'invalid_parent' | 'circular_reference' | 'missing_unit';
    message: string;
    code?: string;
  }> = [];
  
  const allUnits = Array.from(getAllUnitsMap().values());
  const totalUnits = allUnits.length;
  let orphanedUnits = 0;
  let invalidParents = 0;
  let circularReferences = 0;
  let missingUnits = 0;
  
  allUnits.forEach(unit => {
    // Check for orphaned units (non-provinces without parent)
    if (unit.parentCode && !getByCode(unit.parentCode)) {
      issues.push({
        type: 'orphaned',
        message: `Unit '${unit.code}' has missing parent '${unit.parentCode}'`,
        code: unit.code
      });
      orphanedUnits++;
    }
    
    // Check for invalid parent relationships
    if (unit.parentCode) {
      const parent = getByCode(unit.parentCode);
      if (parent) {
        const validation = validateParentChildRelationship(unit.parentCode, unit.code);
        if (!validation.isValid) {
          issues.push({
            type: 'invalid_parent',
            message: validation.error || 'Invalid parent-child relationship',
            code: unit.code
          });
          invalidParents++;
        }
      }
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues,
    summary: {
      totalUnits,
      orphanedUnits,
      invalidParents,
      circularReferences,
      missingUnits
    }
  };
}

/**
 * Validate unit properties
 * @param unit - The unit to validate
 * @returns Validation result
 */
export function validateUnitProperties(unit: AdministrativeUnit): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!unit.code || typeof unit.code !== 'string') {
    issues.push('Missing or invalid code');
  }
  
  if (!unit.name || typeof unit.name !== 'string') {
    issues.push('Missing or invalid name');
  }
  
  if (!unit.slug || typeof unit.slug !== 'string') {
    issues.push('Missing or invalid slug');
  }
  
  // Validate code format
  const codeValidation = validateCodeFormat(unit.code);
  if (!codeValidation.isValid) {
    issues.push(`Invalid code format: ${codeValidation.error}`);
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// Re-export utility functions for cache management
export { preloadData, clearDataCache, getCacheStats } from './utils/lazy-loader';

/**
 * Check which data files are available
 * @returns Object indicating which data files are available
 */
export function getAvailableData(): {
  provinces: boolean;
  districts: boolean;
  sectors: boolean;
  cells: boolean;
  villages: boolean;
} {
  return {
    provinces: (() => { try { getProvincesData(); return true; } catch { return false; } })(),
    districts: (() => { try { getDistrictsData(); return true; } catch { return false; } })(),
    sectors: (() => { try { getSectorsData(); return true; } catch { return false; } })(),
    cells: (() => { try { getCellsData(); return true; } catch { return false; } })(),
    villages: (() => { try { getVillagesData(); return true; } catch { return false; } })()
  };
} 