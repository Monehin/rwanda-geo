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
  if (!isValidCode(code)) {
    return undefined;
  }

  const parts = code.split('-');
  switch (parts.length) {
    case 2:
      return 'province';
    case 3:
      return 'district';
    case 4:
      return 'sector';
    case 5:
      return 'cell';
    case 6:
      return 'village';
    default:
      return undefined;
  }
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