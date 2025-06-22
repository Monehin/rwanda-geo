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

### 📊 Core Data Functions

<details>
<summary><strong>🔄 Data Retrieval Functions</strong></summary>

```ts
// Get all administrative units by level
getAllProvinces(): Province[]
getAllDistricts(): District[]
getAllSectors(): Sector[]
getAllCells(): Cell[]
getAllVillages(): Village[]
```

**Examples:**
```ts
import { getAllProvinces, getAllDistricts } from 'rwanda-geo';

const provinces = getAllProvinces();
// Returns: [{ code: "RW-UMU", name: "Kigali City", slug: "kigali-city" }, ...]

const districts = getAllDistricts();
// Returns: [{ code: "RW-UMU-GAS", name: "Gasabo", slug: "gasabo" }, ...]
```
</details>

### 🗺️ Hierarchical Navigation

<details>
<summary><strong>🔗 Parent-Child Relationships</strong></summary>

```ts
// Navigate the administrative hierarchy
getDistrictsByProvince(provinceCode: string): District[]
getSectorsByDistrict(districtCode: string): Sector[]
getCellsBySector(sectorCode: string): Cell[]
getVillagesByCell(cellCode: string): Village[]
```

**Examples:**
```ts
import { getDistrictsByProvince, getSectorsByDistrict } from 'rwanda-geo';

const kigaliDistricts = getDistrictsByProvince('RW-UMU');
// Returns all districts in Kigali City

const gasaboSectors = getSectorsByDistrict('RW-UMU-GAS');
// Returns all sectors in Gasabo district
```
</details>

<details>
<summary><strong>🎯 Direct Access & Hierarchy</strong></summary>

```ts
// Direct access and hierarchy traversal
getByCode(code: string): AdministrativeUnit | undefined
getHierarchy(code: string): AdministrativeUnit[]
getFullHierarchy(code: string): AdministrativeUnit[]
getDirectChildren(parentCode: string): AdministrativeUnit[]
getSiblings(code: string): AdministrativeUnit[]
getAllDescendants(parentCode: string): AdministrativeUnit[]
```

**Examples:**
```ts
import { getByCode, getHierarchy, getSiblings } from 'rwanda-geo';

const gasabo = getByCode('RW-UMU-GAS');
// Returns: { code: "RW-UMU-GAS", name: "Gasabo", slug: "gasabo", ... }

const hierarchy = getHierarchy('RW-UMU-GAS-BUM');
// Returns: [Province, District, Sector] chain

const siblings = getSiblings('RW-UMU-GAS');
// Returns all districts in Kigali City (same level as Gasabo)
```
</details>

### 🔍 Search & Discovery

<details>
<summary><strong>🔎 Search Functions</strong></summary>

```ts
// Basic search operations
searchByName(name: string): AdministrativeUnit[]
searchBySlug(slug: string): AdministrativeUnit[]
fuzzySearchByName(query: string, threshold?: number, limit?: number): Array<{unit: AdministrativeUnit, score: number}>
searchByPartialCode(partialCode: string, limit?: number): AdministrativeUnit[]
getSuggestions(query: string, limit?: number): Array<{unit: AdministrativeUnit, type: 'exact' | 'fuzzy' | 'partial', matchField: 'name' | 'code' | 'slug'}>
```

**Examples:**
```ts
import { searchByName, fuzzySearchByName, getSuggestions } from 'rwanda-geo';

const exactMatches = searchByName('Gasabo');
// Returns: [{ code: "RW-UMU-GAS", name: "Gasabo", ... }]

const fuzzyResults = fuzzySearchByName('kigali', 0.8, 5);
// Returns: [{ unit: {...}, score: 0.95 }, ...]

const suggestions = getSuggestions('gas', 10);
// Returns: [{ unit: {...}, type: 'exact', matchField: 'name' }, ...]
```
</details>

### ⚙️ Utility Functions

<details>
<summary><strong>🛠️ Helper Functions</strong></summary>

```ts
// Utility and helper functions
getByLevel(level: AdminLevel): AdministrativeUnit[]
getCounts(): { provinces: number; districts: number; sectors: number; cells: number; villages: number }
getSummary(): { provinces: number; districts: number; sectors: number; cells: number; villages: number; total: number }
isValidCode(code: string): boolean
getCodeLevel(code: string): AdminLevel | undefined
```

**Examples:**
```ts
import { getCounts, getSummary, isValidCode } from 'rwanda-geo';

const counts = getCounts();
// Returns: { provinces: 5, districts: 30, sectors: 416, cells: 2148, villages: 14837 }

const summary = getSummary();
// Returns: { provinces: 5, districts: 30, sectors: 416, cells: 2148, villages: 14837, total: 17436 }

const isValid = isValidCode('RW-UMU-GAS');
// Returns: true
```
</details>

### ✅ Validation Functions

<details>
<summary><strong>🔍 Data Validation</strong></summary>

```ts
// Comprehensive validation functions
validateCodeFormat(code: string): { isValid: boolean; error?: string; level?: string; format?: string }
validateParentChildRelationship(parentCode: string, childCode: string): { isValid: boolean; error?: string; parentLevel?: string; childLevel?: string }
validateHierarchyIntegrity(): { isValid: boolean; issues: Array<{type: string, message: string, code?: string}>; summary: { totalUnits: number; orphanedUnits: number; invalidParents: number; circularReferences: number; missingUnits: number } }
validateUnitProperties(unit: AdministrativeUnit): { isValid: boolean; issues: string[] }
```

**Examples:**
```ts
import { validateCodeFormat, validateParentChildRelationship } from 'rwanda-geo';

const formatCheck = validateCodeFormat('RW-UMU-GAS');
// Returns: { isValid: true, level: 'district', format: 'RW-XX-YY' }

const relationshipCheck = validateParentChildRelationship('RW-UMU', 'RW-UMU-GAS');
// Returns: { isValid: true, parentLevel: 'province', childLevel: 'district' }
```
</details>

---

### 📋 Quick Reference

#### **Parameter Types**
| Type | Description | Example |
|------|-------------|---------|
| `string` | Administrative code or name | `'RW-UMU-GAS'`, `'Gasabo'` |
| `number` | Threshold (0-1) or limit | `0.8`, `10` |
| `AdminLevel` | Administrative level | `'district'` |

#### **Return Types**
| Type | Description |
|------|-------------|
| `AdministrativeUnit` | Base unit with `{code, name, slug, parentCode?, center?}` |
| `Province[]` | Array of province units |
| `District[]` | Array of district units |
| `Sector[]` | Array of sector units |
| `Cell[]` | Array of cell units |
| `Village[]` | Array of village units |

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

## 🛠️ Development

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
- Original data structure inspired by [jnkindi/rwanda-locations-json](https://github.com/jnkindi/rwanda-locations-json)
- Built with TypeScript for type safety and developer experience
- Optimized for performance and bundle size

## 📞 Support

- 📧 **Email**: e.monehin@live.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/monehin/rwanda-geo/issues)
- 📖 **Documentation**: [Full API Reference](https://github.com/monehin/rwanda-geo#api-reference)

---

**Made with ❤️ for Rwanda's digital transformation**