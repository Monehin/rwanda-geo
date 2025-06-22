# rwanda-geo

> Reliable, typed, and lightweight dataset of Rwanda's full administrative divisions — from provinces to villages — with geospatial support for mapping and data analysis.

## Features
- **Complete Administrative Hierarchy**: All 5 provinces, 30 districts, 416 sectors, 2,148 cells, and 14,837 villages
- **TypeScript Support**: Fully typed with comprehensive interfaces
- **Hierarchical Navigation**: Parent-child relationships and full hierarchy traversal
- **Advanced Search**: Fuzzy search, partial code matching, and suggestions
- **Validation Utilities**: Code format validation, hierarchy integrity checks
- **GeoJSON Boundaries**: For provinces and districts (expandable to all levels)
- **ESM + CommonJS Support**: Works in both Node.js and browser environments
- **Tree-shakable**: Only import what you need
- **MIT Licensed**: Free for commercial and personal use

## Data Source
This package uses data extracted from `locations.json`, which contains the complete administrative hierarchy of Rwanda with official counts:
- **5 Provinces** (Kigali City, Southern, Western, Northern, Eastern)
- **30 Districts**
- **416 Sectors**
- **2,148 Cells**
- **14,837 Villages** (official count)

## Installation
```bash
npm install rwanda-geo
```

## Quick Start

### Basic Usage
```ts
import { 
  getAllProvinces, 
  getDistrictsByProvince, 
  getByCode, 
  getHierarchy 
} from 'rwanda-geo';

// Get all provinces
const provinces = getAllProvinces();
console.log(provinces);
// [
//   { code: 'RW-KG', name: 'Kigali City', slug: 'kigali-city', ... },
//   { code: 'RW-SO', name: 'Southern Province', slug: 'southern-province', ... },
//   ...
// ]

// Get districts in Kigali City
const kigaliDistricts = getDistrictsByProvince('RW-KG');
console.log(kigaliDistricts.length); // 3

// Get a specific unit by code
const gasabo = getByCode('RW-KG-GAS');
console.log(gasabo?.name); // 'Gasabo'

// Get full hierarchy for a village
const hierarchy = getHierarchy('RW-KG-GAS-BUM-BUM-BUM');
console.log(hierarchy.map(u => u.name));
// ['Kigali City', 'Gasabo', 'Bumbogo', 'Bumbogo', 'Bumbogo']
```

### Advanced Search and Navigation
```ts
import { 
  fuzzySearchByName, 
  getFullHierarchy, 
  getDirectChildren, 
  getSiblings,
  getAllDescendants 
} from 'rwanda-geo';

// Fuzzy search for locations
const searchResults = fuzzySearchByName('kigali', 3, 5);
console.log(searchResults);
// [
//   { unit: { code: 'RW-KG', name: 'Kigali City', ... }, score: 0 },
//   { unit: { code: 'RW-KG-GAS', name: 'Gasabo', ... }, score: 2 },
//   ...
// ]

// Get complete hierarchy with all levels
const fullHierarchy = getFullHierarchy('RW-KG-GAS-BUM-BUM-BUM');
console.log(fullHierarchy.length); // 5 (province -> district -> sector -> cell -> village)

// Get direct children of a district
const gasaboChildren = getDirectChildren('RW-KG-GAS');
console.log(gasaboChildren.length); // 15 sectors

// Get sibling sectors
const siblings = getSiblings('RW-KG-GAS-BUM');
console.log(siblings.length); // 14 (other sectors in Gasabo)

// Get all descendants (sectors, cells, villages)
const allDescendants = getAllDescendants('RW-KG-GAS');
console.log(allDescendants.length); // 15 sectors + 148 cells + 1,037 villages
```

### Validation and Data Integrity
```ts
import { 
  validateCodeFormat, 
  validateParentChildRelationship,
  validateHierarchyIntegrity,
  validateUnitProperties,
  getSummary 
} from 'rwanda-geo';

// Validate code format
const validation = validateCodeFormat('RW-KG-GAS-BUM-BUM-BUM');
console.log(validation);
// { isValid: true, level: 'village', format: 'RW-XX-YY-ZZ-AA-BB' }

// Validate parent-child relationship
const relationship = validateParentChildRelationship('RW-KG-GAS', 'RW-KG-GAS-BUM');
console.log(relationship);
// { isValid: true, parentLevel: 'district', childLevel: 'sector' }

// Check overall hierarchy integrity
const integrity = validateHierarchyIntegrity();
console.log(integrity.isValid); // true
console.log(integrity.summary);
// {
//   totalUnits: 17736,
//   orphanedUnits: 0,
//   invalidParents: 0,
//   circularReferences: 0,
//   missingUnits: 0
// }

// Get data summary
const summary = getSummary();
console.log(summary);
// {
//   provinces: 5,
//   districts: 30,
//   sectors: 416,
//   cells: 2148,
//   villages: 14837,
//   total: 17736
// }
```

## API Reference

### Core Data Functions

#### `getAllProvinces(): Province[]`
Returns all provinces in Rwanda.

#### `getAllDistricts(): District[]`
Returns all districts in Rwanda.

#### `getAllSectors(): Sector[]`
Returns all sectors in Rwanda.

#### `getAllCells(): Cell[]`
Returns all cells in Rwanda.

#### `getAllVillages(): Village[]`
Returns all villages in Rwanda.

### Hierarchical Navigation

#### `getDistrictsByProvince(provinceCode: string): District[]`
Returns all districts within a specific province.

#### `getSectorsByDistrict(districtCode: string): Sector[]`
Returns all sectors within a specific district.

#### `getCellsBySector(sectorCode: string): Cell[]`
Returns all cells within a specific sector.

#### `getVillagesByCell(cellCode: string): Village[]`
Returns all villages within a specific cell.

#### `getByCode(code: string): AdministrativeUnit | undefined`
Returns a specific administrative unit by its unique code.

#### `getHierarchy(code: string): AdministrativeUnit[]`
Returns the complete hierarchy chain from province to the specified unit.

#### `getFullHierarchy(code: string): AdministrativeUnit[]`
Returns the complete hierarchy with all levels from root to the specified unit.

#### `getDirectChildren(parentCode: string): AdministrativeUnit[]`
Returns direct children of a parent unit.

#### `getSiblings(code: string): AdministrativeUnit[]`
Returns sibling units (same parent) of the specified unit.

#### `getAllDescendants(parentCode: string): AdministrativeUnit[]`
Returns all descendants (children, grandchildren, etc.) of a parent unit.

### Search and Discovery

#### `searchByName(name: string): AdministrativeUnit[]`
Case-insensitive search by unit name.

#### `searchBySlug(slug: string): AdministrativeUnit[]`
Case-insensitive search by unit slug.

#### `fuzzySearchByName(query: string, threshold?: number, limit?: number): Array<{ unit: AdministrativeUnit; score: number }>`
Fuzzy search with Levenshtein distance scoring.

#### `searchByPartialCode(partialCode: string, limit?: number): AdministrativeUnit[]`
Search by partial code matching.

#### `getSuggestions(query: string, limit?: number): Array<{ unit: AdministrativeUnit; type: 'exact' | 'fuzzy' | 'partial'; matchField: 'name' | 'code' | 'slug' }>`
Get search suggestions with match type and field information.

### Utility Functions

#### `getByLevel(level: AdminLevel): AdministrativeUnit[]`
Returns all units at a specific administrative level.

#### `getCounts(): { provinces: number; districts: number; sectors: number; cells: number; villages: number }`
Returns counts of units at each administrative level.

#### `getSummary(): { provinces: number; districts: number; sectors: number; cells: number; villages: number; total: number }`
Returns comprehensive summary with total count.

#### `isValidCode(code: string): boolean`
Validates if a code follows the correct format.

#### `getCodeLevel(code: string): AdminLevel | undefined`
Determines the administrative level from a code.

### Validation Functions

#### `validateCodeFormat(code: string): { isValid: boolean; error?: string; level?: string; format?: string }`
Validates code format and returns level information.

#### `validateParentChildRelationship(parentCode: string, childCode: string): { isValid: boolean; error?: string; parentLevel?: string; childLevel?: string }`
Validates parent-child relationship integrity.

#### `validateHierarchyIntegrity(): { isValid: boolean; issues: Array<{ type: string; message: string; code?: string }>; summary: { totalUnits: number; orphanedUnits: number; invalidParents: number; circularReferences: number; missingUnits: number } }`
Comprehensive hierarchy validation.

#### `validateUnitProperties(unit: AdministrativeUnit): { isValid: boolean; issues: string[] }`
Validates individual unit properties.

## Data Structure

### Code Format
- **Province**: `RW-XX` (e.g., `RW-KG` for Kigali City)
- **District**: `RW-XX-YY` (e.g., `RW-KG-GAS` for Gasabo)
- **Sector**: `RW-XX-YY-ZZ` (e.g., `RW-KG-GAS-BUM` for Bumbogo)
- **Cell**: `RW-XX-YY-ZZ-AA` (e.g., `RW-KG-GAS-BUM-BUM` for Bumbogo cell)
- **Village**: `RW-XX-YY-ZZ-AA-BB` (e.g., `RW-KG-GAS-BUM-BUM-BUM` for Bumbogo village)

### Unit Properties
```ts
interface GeoUnit {
  code: string;           // Unique hierarchical code
  name: string;           // Official name
  slug: string;           // URL-friendly slug
  parentCode?: string;    // Parent unit code (undefined for provinces)
  center?: {              // Geographic center coordinates
    lat: number;
    lng: number;
  };
}
```

## Examples

### Building a Location Selector
```ts
import { 
  getAllProvinces, 
  getDistrictsByProvince, 
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell 
} from 'rwanda-geo';

class LocationSelector {
  private provinces = getAllProvinces();
  private selectedProvince?: string;
  private selectedDistrict?: string;
  private selectedSector?: string;
  private selectedCell?: string;

  getProvinces() {
    return this.provinces;
  }

  getDistricts() {
    if (!this.selectedProvince) return [];
    return getDistrictsByProvince(this.selectedProvince);
  }

  getSectors() {
    if (!this.selectedDistrict) return [];
    return getSectorsByDistrict(this.selectedDistrict);
  }

  getCells() {
    if (!this.selectedSector) return [];
    return getCellsBySector(this.selectedSector);
  }

  getVillages() {
    if (!this.selectedCell) return [];
    return getVillagesByCell(this.selectedCell);
  }

  selectProvince(code: string) {
    this.selectedProvince = code;
    this.selectedDistrict = undefined;
    this.selectedSector = undefined;
    this.selectedCell = undefined;
  }

  // ... similar methods for other levels
}
```

### Creating a Search Autocomplete
```ts
import { getSuggestions } from 'rwanda-geo';

function createAutocomplete(input: HTMLInputElement) {
  input.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value;
    if (query.length < 2) return;

    const suggestions = getSuggestions(query, 10);
    
    // Clear previous suggestions
    const dropdown = document.getElementById('suggestions');
    dropdown.innerHTML = '';

    suggestions.forEach(({ unit, type, matchField }) => {
      const item = document.createElement('div');
      item.className = `suggestion-item ${type}`;
      item.innerHTML = `
        <strong>${unit.name}</strong>
        <small>${unit.code} (${matchField})</small>
      `;
      dropdown.appendChild(item);
    });
  });
}
```

### Data Analysis and Reporting
```ts
import { 
  getAllProvinces, 
  getAllDistricts, 
  getSummary,
  getFullHierarchy 
} from 'rwanda-geo';

function generateReport() {
  const summary = getSummary();
  const provinces = getAllProvinces();
  const districts = getAllDistricts();

  console.log('Rwanda Administrative Report');
  console.log('============================');
  console.log(`Total Administrative Units: ${summary.total}`);
  console.log(`Provinces: ${summary.provinces}`);
  console.log(`Districts: ${summary.districts}`);
  console.log(`Sectors: ${summary.sectors}`);
  console.log(`Cells: ${summary.cells}`);
  console.log(`Villages: ${summary.villages}`);

  // Average villages per cell
  const avgVillagesPerCell = summary.villages / summary.cells;
  console.log(`Average villages per cell: ${avgVillagesPerCell.toFixed(2)}`);

  // Average cells per sector
  const avgCellsPerSector = summary.cells / summary.sectors;
  console.log(`Average cells per sector: ${avgCellsPerSector.toFixed(2)}`);

  // Province breakdown
  provinces.forEach(province => {
    const provinceDistricts = districts.filter(d => d.parentCode === province.code);
    console.log(`${province.name}: ${provinceDistricts.length} districts`);
  });
}
```

### Geographic Visualization
```ts
import { getByCode, getFullHierarchy } from 'rwanda-geo';

function visualizeLocation(code: string) {
  const hierarchy = getFullHierarchy(code);
  const targetUnit = getByCode(code);
  
  if (!targetUnit) return;

  // Create breadcrumb navigation
  const breadcrumb = hierarchy.map(unit => ({
    name: unit.name,
    code: unit.code,
    level: getCodeLevel(unit.code)
  }));

  // Get geographic center if available
  const center = targetUnit.center;
  
  // Example for mapping libraries
  if (center) {
    // For Leaflet
    // map.setView([center.lat, center.lng], 12);
    
    // For Google Maps
    // map.setCenter({ lat: center.lat, lng: center.lng });
    // map.setZoom(12);
  }

  return {
    unit: targetUnit,
    hierarchy: breadcrumb,
    center
  };
}
```

## Development

### Data Generation
To regenerate the data files from the source `locations.json`:
```bash
node scripts/generate-data.js
```

### Code Quality
The project uses TypeScript for type safety. To check types:
```bash
npm run type-check
```

### Linting
The codebase uses ESLint with TypeScript support to ensure code quality and catch unused code or bad patterns. Test files (`*.test.ts`) are currently ignored by the linter for compatibility. To lint the codebase:
```bash
npm run lint
```
- All linting issues have been resolved and the codebase is clean.
- If you want to lint test files, add them to your `tsconfig.json` or adjust the ESLint config.

### Testing
```bash
npm test
```

## Data Structure
- `src/data/` — JSON files for each administrative level
- `src/boundaries/` — GeoJSON boundaries
- `src/types.ts` — TypeScript type definitions
- `src/helpers.ts` — Helper functions for querying data

## License
MIT 