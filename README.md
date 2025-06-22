# 🇷🇼 Rwanda Geo

> **Complete, typed, and lightweight dataset of Rwanda's administrative divisions** - from provinces to villages - with advanced geospatial support for mapping, data analysis, and location-based applications.

[![npm version](https://badge.fury.io/js/rwanda-geo.svg)](https://badge.fury.io/js/rwanda-geo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/min/rwanda-geo)](https://bundlephobia.com/package/rwanda-geo)

## ✨ Features

- **🗺️ Complete Administrative Hierarchy**: All 5 provinces, 30 districts, 416 sectors, 2,148 cells, and 14,837 villages
- **🔍 Advanced Search & Navigation**: Fuzzy search, hierarchical traversal, and intelligent suggestions
- **🛡️ TypeScript First**: Fully typed with comprehensive interfaces and IntelliSense support
- **⚡ High Performance**: Optimized data structures with 92% compression (373KB package size)
- **🌐 Universal Support**: Works in Node.js, browsers, and modern JavaScript environments
- **🔧 Validation Tools**: Built-in data integrity checks and format validation
- **📊 Rich Metadata**: Geographic coordinates, hierarchical relationships, and official codes
- **🎯 Tree-shakable**: Only import what you need to keep your bundle size minimal

## 📦 Installation

```bash
npm install rwanda-geo
```

```bash
yarn add rwanda-geo
```

```bash
pnpm add rwanda-geo
```

## 🚀 Quick Start

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
```

**Output:**
```json
[
  { "code": "RW-UMU", "name": "Kigali City", "slug": "kigali-city" },
  { "code": "RW-AMA", "name": "Southern Province", "slug": "southern-province" },
  { "code": "RW-IBU", "name": "Western Province", "slug": "western-province" },
  { "code": "RW-AMA-4", "name": "Northern Province", "slug": "northern-province" },
  { "code": "RW-IBU-5", "name": "Eastern Province", "slug": "eastern-province" }
]
```

### Hierarchical Navigation

```ts
// Get districts in Kigali City
const kigaliDistricts = getDistrictsByProvince('RW-UMU');

// Get a specific administrative unit
const gasabo = getByCode('RW-UMU-GAS');

// Get complete hierarchy for any location
const hierarchy = getHierarchy('RW-UMU-GAS-BUM-BUM-BUM');
```

### Advanced Search

```ts
import { fuzzySearchByName, getSuggestions } from 'rwanda-geo';

// Fuzzy search with scoring
const results = fuzzySearchByName('kigali', 0.8, 5);

// Smart suggestions with match types
const suggestions = getSuggestions('gas', 10);
```

## 📊 Data Overview

This package contains the complete administrative hierarchy of Rwanda with official counts:

| Level | Count | Example Code | Example Name |
|-------|-------|--------------|--------------|
| **Provinces** | 5 | `RW-UMU` | Kigali City |
| **Districts** | 30 | `RW-UMU-GAS` | Gasabo |
| **Sectors** | 416 | `RW-UMU-GAS-BUM` | Bumbogo |
| **Cells** | 2,148 | `RW-UMU-GAS-BUM-BUM` | Bumbogo |
| **Villages** | 14,837 | `RW-UMU-GAS-BUM-BUM-BUM` | Bumbogo |

**Total: 17,436 administrative units**

## 🔧 API Reference

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

## 📋 Data Structure

### Code Format
Each administrative unit has a unique hierarchical code:

- **Province**: `RW-XX` (e.g., `RW-UMU` for Kigali City)
- **District**: `RW-XX-YY` (e.g., `RW-UMU-GAS` for Gasabo)
- **Sector**: `RW-XX-YY-ZZ` (e.g., `RW-UMU-GAS-BUM` for Bumbogo)
- **Cell**: `RW-XX-YY-ZZ-AA` (e.g., `RW-UMU-GAS-BUM-BUM` for Bumbogo cell)
- **Village**: `RW-XX-YY-ZZ-AA-BB` (e.g., `RW-UMU-GAS-BUM-BUM-BUM` for Bumbogo village)

### Unit Properties
```ts
interface AdministrativeUnit {
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

## 💡 Practical Examples

### 1. Building a Location Selector

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

### 2. Creating a Search Autocomplete

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

### 3. Data Analysis and Reporting

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

  const report = {
    title: 'Rwanda Administrative Report',
    totalUnits: summary.total,
    provinces: summary.provinces,
    districts: summary.districts,
    sectors: summary.sectors,
    cells: summary.cells,
    villages: summary.villages,
    averages: {
      villagesPerCell: summary.villages / summary.cells,
      cellsPerSector: summary.cells / summary.sectors
    },
    provinceBreakdown: provinces.map(province => {
      const provinceDistricts = districts.filter(d => d.parentCode === province.code);
      return {
        name: province.name,
        districtCount: provinceDistricts.length
      };
    })
  };

  return report;
}
```

### 4. Geographic Visualization

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

### 5. Form Validation

```ts
import { 
  validateCodeFormat, 
  validateParentChildRelationship,
  getByCode 
} from 'rwanda-geo';

function validateLocationForm(provinceCode: string, districtCode: string) {
  const errors: string[] = [];

  // Validate province code format
  const provinceValidation = validateCodeFormat(provinceCode);
  if (!provinceValidation.isValid) {
    errors.push(`Invalid province code: ${provinceValidation.error}`);
  }

  // Validate district code format
  const districtValidation = validateCodeFormat(districtCode);
  if (!districtValidation.isValid) {
    errors.push(`Invalid district code: ${districtValidation.error}`);
  }

  // Validate parent-child relationship
  const relationshipValidation = validateParentChildRelationship(provinceCode, districtCode);
  if (!relationshipValidation.isValid) {
    errors.push(`Invalid relationship: ${relationshipValidation.error}`);
  }

  // Check if units exist
  if (!getByCode(provinceCode)) {
    errors.push('Province not found');
  }
  if (!getByCode(districtCode)) {
    errors.push('District not found');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## 🛠️ Development

### Automated Build Process
The project uses an automated build process that handles data compression and file management:

- **`npm run build`**: Automatically gzips JSON data files, builds the TypeScript code, and copies gzipped files to the build output
- **`npm run build:all`**: Cleans the build directory, then runs the full build process
- **`npm run gzip-data`**: Manually gzip JSON data files (usually not needed as it's automated)

The build process reduces data file sizes by ~92% using gzip compression while maintaining full functionality.

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

## 📁 Project Structure
```
rwanda-geo/
├── src/
│   ├── data/           # JSON data files (gzipped for production)
│   ├── boundaries/     # GeoJSON boundaries
│   ├── types.ts        # TypeScript type definitions
│   ├── helpers.ts      # Core helper functions
│   └── index.ts        # Main entry point
├── examples/           # Usage examples
├── scripts/            # Build and data processing scripts
└── dist/              # Build output
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/monehin/rwanda-geo.git
cd rwanda-geo
npm install
npm run build:all
npm test
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Data sourced from official Rwanda administrative divisions
- Built with TypeScript for type safety and developer experience
- Optimized for performance and bundle size

## 📞 Support

- 📧 **Email**: e.monehin@live.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/monehin/rwanda-geo/issues)
- 📖 **Documentation**: [Full API Reference](https://github.com/monehin/rwanda-geo#api-reference)

---

**Made with ❤️ for Rwanda's digital transformation**