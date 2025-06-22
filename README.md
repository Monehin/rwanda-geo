# 🇷🇼 Rwanda Geo

> **Complete, typed, and lightweight dataset of Rwanda's administrative divisions** - Provinces, Districts, Sectors, Cells, Villages.

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

| Function | Description | Parameters | Returns | Example |
|----------|-------------|------------|---------|---------|
| `getAllProvinces()` | Returns all provinces in Rwanda | None | `Province[]` | `getAllProvinces()` |
| `getAllDistricts()` | Returns all districts in Rwanda | None | `District[]` | `getAllDistricts()` |
| `getAllSectors()` | Returns all sectors in Rwanda | None | `Sector[]` | `getAllSectors()` |
| `getAllCells()` | Returns all cells in Rwanda | None | `Cell[]` | `getAllCells()` |
| `getAllVillages()` | Returns all villages in Rwanda | None | `Village[]` | `getAllVillages()` |

### Hierarchical Navigation

| Function | Description | Parameters | Returns | Example |
|----------|-------------|------------|---------|---------|
| `getDistrictsByProvince(provinceCode)` | Returns districts within a province | `provinceCode: string` | `District[]` | `getDistrictsByProvince('RW-UMU')` |
| `getSectorsByDistrict(districtCode)` | Returns sectors within a district | `districtCode: string` | `Sector[]` | `getSectorsByDistrict('RW-UMU-GAS')` |
| `getCellsBySector(sectorCode)` | Returns cells within a sector | `sectorCode: string` | `Cell[]` | `getCellsBySector('RW-UMU-GAS-BUM')` |
| `getVillagesByCell(cellCode)` | Returns villages within a cell | `cellCode: string` | `Village[]` | `getVillagesByCell('RW-UMU-GAS-BUM-BUM')` |
| `getByCode(code)` | Returns unit by unique code | `code: string` | `AdministrativeUnit \| undefined` | `getByCode('RW-UMU-GAS')` |
| `getHierarchy(code)` | Returns hierarchy chain from province to unit | `code: string` | `AdministrativeUnit[]` | `getHierarchy('RW-UMU-GAS-BUM')` |
| `getFullHierarchy(code)` | Returns complete hierarchy with all levels | `code: string` | `AdministrativeUnit[]` | `getFullHierarchy('RW-UMU-GAS-BUM')` |
| `getDirectChildren(parentCode)` | Returns direct children of parent unit | `parentCode: string` | `AdministrativeUnit[]` | `getDirectChildren('RW-UMU')` |
| `getSiblings(code)` | Returns sibling units (same parent) | `code: string` | `AdministrativeUnit[]` | `getSiblings('RW-UMU-GAS')` |
| `getAllDescendants(parentCode)` | Returns all descendants of parent unit | `parentCode: string` | `AdministrativeUnit[]` | `getAllDescendants('RW-UMU')` |

### Search and Discovery

| Function | Description | Parameters | Returns | Example |
|----------|-------------|------------|---------|---------|
| `searchByName(name)` | Case-insensitive search by unit name | `name: string` | `AdministrativeUnit[]` | `searchByName('Gasabo')` |
| `searchBySlug(slug)` | Case-insensitive search by unit slug | `slug: string` | `AdministrativeUnit[]` | `searchBySlug('gasabo')` |
| `fuzzySearchByName(query, threshold?, limit?)` | Fuzzy search with Levenshtein scoring | `query: string, threshold?: number, limit?: number` | `Array<{unit: AdministrativeUnit, score: number}>` | `fuzzySearchByName('kigali', 0.8, 5)` |
| `searchByPartialCode(partialCode, limit?)` | Search by partial code matching | `partialCode: string, limit?: number` | `AdministrativeUnit[]` | `searchByPartialCode('RW-UMU', 10)` |
| `getSuggestions(query, limit?)` | Get search suggestions with match info | `query: string, limit?: number` | `Array<{unit: AdministrativeUnit, type: 'exact' \| 'fuzzy' \| 'partial', matchField: 'name' \| 'code' \| 'slug'}>` | `getSuggestions('gas', 10)` |

### Utility Functions

| Function | Description | Parameters | Returns | Example |
|----------|-------------|------------|---------|---------|
| `getByLevel(level)` | Returns all units at specific level | `level: AdminLevel` | `AdministrativeUnit[]` | `getByLevel('district')` |
| `getCounts()` | Returns counts of units at each level | None | `{provinces: number, districts: number, sectors: number, cells: number, villages: number}` | `getCounts()` |
| `getSummary()` | Returns comprehensive summary with total | None | `{provinces: number, districts: number, sectors: number, cells: number, villages: number, total: number}` | `getSummary()` |
| `isValidCode(code)` | Validates if code follows correct format | `code: string` | `boolean` | `isValidCode('RW-UMU-GAS')` |
| `getCodeLevel(code)` | Determines level from code | `code: string` | `AdminLevel \| undefined` | `getCodeLevel('RW-UMU-GAS')` |

### Validation Functions

| Function | Description | Parameters | Returns | Example |
|----------|-------------|------------|---------|---------|
| `validateCodeFormat(code)` | Validates code format and returns level info | `code: string` | `{isValid: boolean, error?: string, level?: string, format?: string}` | `validateCodeFormat('RW-UMU-GAS')` |
| `validateParentChildRelationship(parentCode, childCode)` | Validates parent-child relationship integrity | `parentCode: string, childCode: string` | `{isValid: boolean, error?: string, parentLevel?: string, childLevel?: string}` | `validateParentChildRelationship('RW-UMU', 'RW-UMU-GAS')` |
| `validateHierarchyIntegrity()` | Comprehensive hierarchy validation | None | `{isValid: boolean, issues: Array<{type: string, message: string, code?: string}>, summary: {totalUnits: number, orphanedUnits: number, invalidParents: number, circularReferences: number, missingUnits: number}}` | `validateHierarchyIntegrity()` |
| `validateUnitProperties(unit)` | Validates individual unit properties | `unit: AdministrativeUnit` | `{isValid: boolean, issues: string[]}` | `validateUnitProperties(province)` |

### Parameter Types

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `code` | `string` | Unique hierarchical code | `'RW-UMU-GAS'` |
| `name` | `string` | Administrative unit name | `'Gasabo'` |
| `slug` | `string` | URL-friendly identifier | `'gasabo'` |
| `threshold` | `number` | Fuzzy search threshold (0-1) | `0.8` |
| `limit` | `number` | Maximum results to return | `10` |
| `level` | `AdminLevel` | Administrative level | `'district'` |

### Return Types

| Type | Description | Properties |
|------|-------------|------------|
| `AdministrativeUnit` | Base unit interface | `{code: string, name: string, slug: string, parentCode?: string, center?: {lat: number, lng: number}}` |
| `Province` | Province unit | Extends `AdministrativeUnit` |
| `District` | District unit | Extends `AdministrativeUnit` |
| `Sector` | Sector unit | Extends `AdministrativeUnit` |
| `Cell` | Cell unit | Extends `AdministrativeUnit` |
| `Village` | Village unit | Extends `AdministrativeUnit` |
| `AdminLevel` | Administrative level enum | `'province' \| 'district' \| 'sector' \| 'cell' \| 'village'` |

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

### 3. Form Validation

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

### Automated Publishing Workflow
This project uses GitHub Actions for automated npm publishing. There are several ways to trigger a release:

#### Method 1: Using Release Scripts (Recommended)
```bash
# For patch releases (1.0.5 → 1.0.6)
npm run release:patch

# For minor releases (1.0.5 → 1.1.0)
npm run release:minor

# For major releases (1.0.5 → 2.0.0)
npm run release:major
```

The release script will:
1. ✅ Check if working directory is clean
2. 🧪 Run all tests
3. 🔨 Build the package
4. 📦 Bump the version
5. 📤 Push changes and create git tag
6. 🎉 Guide you to create a GitHub release

#### Method 2: Manual GitHub Actions
1. Go to [Actions](https://github.com/monehin/rwanda-geo/actions)
2. Select "Version and Publish to NPM"
3. Click "Run workflow"
4. Choose version type (patch/minor/major)
5. Click "Run workflow"

#### Method 3: Git Tags
```bash
# Create and push a tag
git tag v1.0.6
git push origin v1.0.6
```

### Setup Required
To enable automated publishing, you need to:

1. **Create NPM Token:**
   - Go to [npmjs.com](https://www.npmjs.com/settings/tokens)
   - Create a new "Automation" token
   - Copy the token

2. **Add GitHub Secret:**
   - Go to your GitHub repository settings
   - Navigate to "Secrets and variables" → "Actions"
   - Create a new secret named `NPM_TOKEN`
   - Paste your npm token

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