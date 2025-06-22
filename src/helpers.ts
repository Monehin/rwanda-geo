import provinces from './data/provinces.json';
import districts from './data/districts.json';
import sectors from './data/sectors.json';
import cells from './data/cells.json';
import villages from './data/villages.json';
import { Province, District, Sector, Cell, Village, AdministrativeUnit } from './types';

// Type the imported JSON data
const provincesData = provinces as Province[];
const districtsData = districts as District[];
const sectorsData = sectors as Sector[];
const cellsData = cells as Cell[];
const villagesData = villages as Village[];

// Create a map for fast lookups
const allUnits = new Map<string, AdministrativeUnit>();

// Populate the map with all units
provincesData.forEach(province => allUnits.set(province.code, province));
districtsData.forEach(district => allUnits.set(district.code, district));
sectorsData.forEach(sector => allUnits.set(sector.code, sector));
cellsData.forEach(cell => allUnits.set(cell.code, cell));
villagesData.forEach(village => allUnits.set(village.code, village));

/**
 * Get all provinces in Rwanda
 * @returns Array of all provinces
 */
export function getAllProvinces(): Province[] {
  return [...provincesData];
}

/**
 * Get all districts in Rwanda
 * @returns Array of all districts
 */
export function getAllDistricts(): District[] {
  return [...districtsData];
}

/**
 * Get all sectors in Rwanda
 * @returns Array of all sectors
 */
export function getAllSectors(): Sector[] {
  return [...sectorsData];
}

/**
 * Get all cells in Rwanda
 * @returns Array of all cells
 */
export function getAllCells(): Cell[] {
  return [...cellsData];
}

/**
 * Get all villages in Rwanda
 * @returns Array of all villages
 */
export function getAllVillages(): Village[] {
  return [...villagesData];
}

/**
 * Get districts by province code
 * @param provinceCode - The province code (e.g., 'RW-KG')
 * @returns Array of districts in the specified province
 */
export function getDistrictsByProvince(provinceCode: string): District[] {
  return districtsData.filter(district => district.parentCode === provinceCode);
}

/**
 * Get sectors by district code
 * @param districtCode - The district code (e.g., 'RW-KG-GAS')
 * @returns Array of sectors in the specified district
 */
export function getSectorsByDistrict(districtCode: string): Sector[] {
  return sectorsData.filter(sector => sector.parentCode === districtCode);
}

/**
 * Get cells by sector code
 * @param sectorCode - The sector code (e.g., 'RW-KG-GAS-BUM')
 * @returns Array of cells in the specified sector
 */
export function getCellsBySector(sectorCode: string): Cell[] {
  return cellsData.filter(cell => cell.parentCode === sectorCode);
}

/**
 * Get villages by cell code
 * @param cellCode - The cell code (e.g., 'RW-KG-GAS-BUM-BUM')
 * @returns Array of villages in the specified cell
 */
export function getVillagesByCell(cellCode: string): Village[] {
  return villagesData.filter(village => village.parentCode === cellCode);
}

/**
 * Get a geographical unit by its code
 * @param code - The unique code of the unit
 * @returns The geographical unit or undefined if not found
 */
export function getByCode(code: string): AdministrativeUnit | undefined {
  return allUnits.get(code);
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
  return Array.from(allUnits.values()).filter(unit => unit.parentCode === parentCode);
}

/**
 * Search for units by name (case-insensitive)
 * @param name - The name to search for
 * @returns Array of units matching the name
 */
export function searchByName(name: string): AdministrativeUnit[] {
  const searchTerm = name.toLowerCase();
  return Array.from(allUnits.values()).filter(unit => 
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
  return Array.from(allUnits.values()).filter(unit => 
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
  return {
    provinces: provincesData.length,
    districts: districtsData.length,
    sectors: sectorsData.length,
    cells: cellsData.length,
    villages: villagesData.length,
    total: provincesData.length + districtsData.length + sectorsData.length + cellsData.length + villagesData.length
  };
}

/**
 * Validate if a code follows the Rwanda administrative code format
 * @param code - The code to validate
 * @returns True if the code format is valid
 */
export function isValidCode(code: string): boolean {
  // Format: RW-XX[-YY][-ZZ][-AA][-BB]
  // Where XX = province, YY = district, ZZ = sector, AA = cell, BB = village
  const codePattern = /^RW-[A-Z]{2}(-[A-Z]{3}){0,4}$/;
  return codePattern.test(code);
}

/**
 * Get the administrative level of a code
 * @param code - The code to analyze
 * @returns The administrative level or undefined if invalid
 */
export function getCodeLevel(code: string): 'province' | 'district' | 'sector' | 'cell' | 'village' | undefined {
  if (!code || typeof code !== 'string') return undefined;
  const parts = code.split('-');
  if (parts[0] !== 'RW') return undefined;
  // Count segments after RW
  const segs = parts.length - 1;
  if (segs === 1) return 'province';
  if (segs === 2) return 'district';
  if (segs === 3) return 'sector';
  if (segs === 4) return 'cell';
  if (segs >= 5) return 'village';
  return undefined;
}

export function getSummary() {
  return {
    provinces: getAllProvinces().length,
    districts: getAllDistricts().length,
    sectors: getAllSectors().length,
    cells: getAllCells().length,
    villages: getAllVillages().length,
  };
}

/**
 * Get the complete hierarchy chain for any administrative unit
 * @param code - The code of any administrative unit
 * @returns Array of units from province down to the specified unit
 */
export function getFullHierarchy(code: string): AdministrativeUnit[] {
  const unit = getByCode(code);
  if (!unit) return [];

  const hierarchy: AdministrativeUnit[] = [unit];
  let currentUnit = unit;

  // Walk up the hierarchy until we reach a province
  while (currentUnit.parentCode) {
    const parent = getByCode(currentUnit.parentCode);
    if (!parent) break;
    hierarchy.unshift(parent);
    currentUnit = parent;
  }

  return hierarchy;
}

/**
 * Get all direct children of an administrative unit
 * @param parentCode - The code of the parent unit
 * @returns Array of direct children
 */
export function getDirectChildren(parentCode: string): AdministrativeUnit[] {
  const parent = getByCode(parentCode);
  if (!parent) return [];

  const parentLevel = getCodeLevel(parentCode);
  if (!parentLevel) return [];

  // Determine the child level
  const childLevelMap: Record<string, string> = {
    'province': 'district',
    'district': 'sector', 
    'sector': 'cell',
    'cell': 'village'
  };

  const childLevel = childLevelMap[parentLevel];
  if (!childLevel) return [];

  // Get all units at the child level and filter by parent
  const allChildren = getByLevel(childLevel as 'province' | 'district' | 'sector' | 'cell' | 'village');
  return allChildren.filter(child => child.parentCode === parentCode);
}

/**
 * Get all siblings of an administrative unit (same level, same parent)
 * @param code - The code of the unit
 * @returns Array of siblings (excluding the unit itself)
 */
export function getSiblings(code: string): AdministrativeUnit[] {
  const unit = getByCode(code);
  if (!unit || !unit.parentCode) return [];

  const siblings = getDirectChildren(unit.parentCode);
  return siblings.filter(sibling => sibling.code !== code);
}

/**
 * Get all descendants of an administrative unit (all children, grandchildren, etc.)
 * @param parentCode - The code of the parent unit
 * @returns Array of all descendants
 */
export function getAllDescendants(parentCode: string): AdministrativeUnit[] {
  const descendants: AdministrativeUnit[] = [];
  const directChildren = getDirectChildren(parentCode);
  
  descendants.push(...directChildren);
  
  // Recursively get descendants of each child
  directChildren.forEach(child => {
    descendants.push(...getAllDescendants(child.code));
  });
  
  return descendants;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Distance (lower = more similar)
 */
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
 * Fuzzy search by name with configurable threshold
 * @param query - Search query
 * @param threshold - Maximum distance for a match (default: 3)
 * @param limit - Maximum number of results (default: 10)
 * @returns Array of matches with similarity scores
 */
export function fuzzySearchByName(
  query: string, 
  threshold: number = 3, 
  limit: number = 10
): Array<{ unit: AdministrativeUnit; score: number }> {
  const normalizedQuery = query.toLowerCase().trim();
  const allUnits = [
    ...getAllProvinces(),
    ...getAllDistricts(),
    ...getAllSectors(),
    ...getAllCells(),
    ...getAllVillages()
  ];

  const results: Array<{ unit: AdministrativeUnit; score: number }> = [];

  allUnits.forEach(unit => {
    const distance = levenshteinDistance(normalizedQuery, unit.name.toLowerCase());
    if (distance <= threshold) {
      results.push({ unit, score: 1 - (distance / Math.max(normalizedQuery.length, unit.name.length)) });
    }
  });

  // Sort by score (highest first) and limit results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Search by partial code (prefix matching)
 * @param partialCode - Partial code to search for
 * @param limit - Maximum number of results (default: 20)
 * @returns Array of matching units
 */
export function searchByPartialCode(partialCode: string, limit: number = 20): AdministrativeUnit[] {
  const normalizedCode = partialCode.toUpperCase().trim();
  const allUnits = [
    ...getAllProvinces(),
    ...getAllDistricts(),
    ...getAllSectors(),
    ...getAllCells(),
    ...getAllVillages()
  ];

  return allUnits
    .filter(unit => unit.code.startsWith(normalizedCode))
    .slice(0, limit);
}

/**
 * Get autocomplete suggestions based on name or code
 * @param query - Partial query
 * @param limit - Maximum number of suggestions (default: 10)
 * @returns Array of suggestions with type and match info
 */
export function getSuggestions(
  query: string, 
  limit: number = 10
): Array<{ 
  unit: AdministrativeUnit; 
  type: 'exact' | 'fuzzy' | 'partial'; 
  matchField: 'name' | 'code' | 'slug';
}> {
  const normalizedQuery = query.toLowerCase().trim();
  const allUnits = [
    ...getAllProvinces(),
    ...getAllDistricts(),
    ...getAllSectors(),
    ...getAllCells(),
    ...getAllVillages()
  ];

  const suggestions: Array<{ 
    unit: AdministrativeUnit; 
    type: 'exact' | 'fuzzy' | 'partial'; 
    matchField: 'name' | 'code' | 'slug';
  }> = [];

  allUnits.forEach(unit => {
    // Exact matches (highest priority)
    if (unit.name.toLowerCase() === normalizedQuery) {
      suggestions.push({ unit, type: 'exact', matchField: 'name' });
    } else if (unit.code.toLowerCase() === normalizedQuery) {
      suggestions.push({ unit, type: 'exact', matchField: 'code' });
    } else if (unit.slug === normalizedQuery) {
      suggestions.push({ unit, type: 'exact', matchField: 'slug' });
    }
    // Partial matches
    else if (unit.name.toLowerCase().includes(normalizedQuery)) {
      suggestions.push({ unit, type: 'partial', matchField: 'name' });
    } else if (unit.code.toLowerCase().includes(normalizedQuery)) {
      suggestions.push({ unit, type: 'partial', matchField: 'code' });
    } else if (unit.slug.includes(normalizedQuery)) {
      suggestions.push({ unit, type: 'partial', matchField: 'slug' });
    }
    // Fuzzy matches (only if no exact/partial matches found)
    else if (suggestions.length < limit) {
      const distance = levenshteinDistance(normalizedQuery, unit.name.toLowerCase());
      if (distance <= 3) {
        suggestions.push({ unit, type: 'fuzzy', matchField: 'name' });
      }
    }
  });

  // Sort by type priority and limit results
  const typePriority = { exact: 3, partial: 2, fuzzy: 1 };
  return suggestions
    .sort((a, b) => typePriority[b.type] - typePriority[a.type])
    .slice(0, limit);
}

/**
 * Validate if a parent-child relationship is correct
 * @param parentCode - The parent code
 * @param childCode - The child code
 * @returns Object with validation result and details
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
    return { isValid: false, error: `Parent code '${parentCode}' does not exist` };
  }

  if (!child) {
    return { isValid: false, error: `Child code '${childCode}' does not exist` };
  }

  const parentLevel = getCodeLevel(parentCode);
  const childLevel = getCodeLevel(childCode);

  if (!parentLevel || !childLevel) {
    return { isValid: false, error: 'Invalid code levels' };
  }

  // Check if child actually has the specified parent
  if (child.parentCode !== parentCode) {
    return { 
      isValid: false, 
      error: `Child '${childCode}' has parent '${child.parentCode}', not '${parentCode}'`,
      parentLevel,
      childLevel
    };
  }

  // Validate hierarchy levels
  const validHierarchy = {
    'province': ['district'],
    'district': ['sector'],
    'sector': ['cell'],
    'cell': ['village']
  };

  const validChildren = validHierarchy[parentLevel as keyof typeof validHierarchy];
  if (!validChildren || !validChildren.includes(childLevel)) {
    return { 
      isValid: false, 
      error: `Invalid hierarchy: ${parentLevel} cannot have ${childLevel} as child`,
      parentLevel,
      childLevel
    };
  }

  return { isValid: true, parentLevel, childLevel };
}

/**
 * Validate code format compliance
 * @param code - The code to validate
 * @returns Object with validation result and details
 */
export function validateCodeFormat(code: string): { 
  isValid: boolean; 
  error?: string; 
  level?: string; 
  format?: string; 
} {
  if (!code || typeof code !== 'string') {
    return { isValid: false, error: 'Code must be a non-empty string' };
  }

  const level = getCodeLevel(code);
  if (!level) {
    return { isValid: false, error: 'Invalid code format - cannot determine level' };
  }

  // Loosened patterns: allow extra hyphen-separated segments for uniqueness
  const patterns = {
    'province': /^RW(-[A-Z0-9]+)+$/, // At least one segment after RW
    'district': /^RW(-[A-Z0-9]+){2,}$/, // At least two segments after RW
    'sector': /^RW(-[A-Z0-9]+){3,}$/, // At least three segments after RW
    'cell': /^RW(-[A-Z0-9]+){4,}$/, // At least four segments after RW
    'village': /^RW(-[A-Z0-9]+){5,}$/ // At least five segments after RW
  };

  const pattern = patterns[level as keyof typeof patterns];
  if (!pattern.test(code)) {
    return { 
      isValid: false, 
      error: `Code '${code}' does not match expected format for ${level}`,
      level,
      format: pattern.toString()
    };
  }

  return { isValid: true, level };
}

/**
 * Validate hierarchy integrity for the entire dataset
 * @returns Object with validation results and any issues found
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

  const allUnits = [
    ...getAllProvinces(),
    ...getAllDistricts(),
    ...getAllSectors(),
    ...getAllCells(),
    ...getAllVillages()
  ];

  let orphanedUnits = 0;
  let invalidParents = 0;
  let circularReferences = 0;
  let missingUnits = 0;

  allUnits.forEach(unit => {
    // Check for orphaned units (except provinces)
    if (unit.parentCode) {
      const parent = getByCode(unit.parentCode);
      if (!parent) {
        issues.push({
          type: 'orphaned',
          message: `Unit '${unit.code}' has non-existent parent '${unit.parentCode}'`,
          code: unit.code
        });
        orphanedUnits++;
      } else {
        // Check for circular references
        const hierarchy = getFullHierarchy(unit.code);
        const hierarchyCodes = hierarchy.map(h => h.code);
        if (hierarchyCodes.includes(unit.code) && hierarchyCodes.indexOf(unit.code) !== hierarchyCodes.length - 1) {
          issues.push({
            type: 'circular_reference',
            message: `Circular reference detected in hierarchy for '${unit.code}'`,
            code: unit.code
          });
          circularReferences++;
        }

        // Validate parent-child relationship
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

  // Check for missing units in hierarchy chains
  allUnits.forEach(unit => {
    if (unit.parentCode) {
      const hierarchy = getFullHierarchy(unit.code);
      const expectedLength = getCodeLevel(unit.code) === 'village' ? 5 : 
                            getCodeLevel(unit.code) === 'cell' ? 4 :
                            getCodeLevel(unit.code) === 'sector' ? 3 :
                            getCodeLevel(unit.code) === 'district' ? 2 : 1;
      
      if (hierarchy.length !== expectedLength) {
        issues.push({
          type: 'missing_unit',
          message: `Incomplete hierarchy for '${unit.code}': expected ${expectedLength} levels, got ${hierarchy.length}`,
          code: unit.code
        });
        missingUnits++;
      }
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
    summary: {
      totalUnits: allUnits.length,
      orphanedUnits,
      invalidParents,
      circularReferences,
      missingUnits
    }
  };
}

/**
 * Validate that all required properties are present and have correct types
 * @param unit - The administrative unit to validate
 * @returns Object with validation result and any issues
 */
export function validateUnitProperties(unit: AdministrativeUnit): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check required properties that exist on all levels
  if (!unit.code || typeof unit.code !== 'string') {
    issues.push('Missing or invalid code property');
  }

  if (!unit.name || typeof unit.name !== 'string') {
    issues.push('Missing or invalid name property');
  }

  if (!unit.slug || typeof unit.slug !== 'string') {
    issues.push('Missing or invalid slug property');
  }

  // Check center property (optional but should be valid if present)
  if (unit.center) {
    if (typeof unit.center !== 'object') {
      issues.push('Invalid center property (must be an object)');
    } else {
      if (typeof unit.center.lat !== 'number' || typeof unit.center.lng !== 'number') {
        issues.push('Invalid center coordinates (lat/lng must be numbers)');
      }
    }
  }

  // Check level-specific properties
  const level = getCodeLevel(unit.code);
  if (level === 'village') {
    // Villages have shortCode property
    if (!('shortCode' in unit) || typeof (unit as Village).shortCode !== 'string') {
      issues.push('Missing or invalid shortCode property (required for villages)');
    }
  }

  // Validate code format if code exists
  if (unit.code) {
    const codeValidation = validateCodeFormat(unit.code);
    if (!codeValidation.isValid) {
      issues.push(`Code format validation failed: ${codeValidation.error}`);
    }
  }

  // Validate slug format
  if (unit.slug && !/^[a-z0-9-]+$/.test(unit.slug)) {
    issues.push('Invalid slug format (must be lowercase, alphanumeric, hyphens only)');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
} 