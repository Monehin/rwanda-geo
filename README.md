# Rwanda-Geo 🇷🇼

[![npm version](https://badge.fury.io/js/rwanda-geo.svg)](https://badge.fury.io/js/rwanda-geo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/min/rwanda-geo)](https://bundlephobia.com/package/rwanda-geo)

> **Complete, typed, and lightweight dataset of Rwanda's administrative divisions** - Provinces, Districts, Sectors, Cells, Villages.

## ✨ Features

- **🗺️ Complete Administrative Hierarchy**: All 5 provinces, 30 districts, 416 sectors, 2,148 cells, and 14,837 villages
- **🔍 Advanced Search & Navigation**: Fuzzy search, hierarchical traversal, and intelligent suggestions
- **🛡️ TypeScript First**: Fully typed with comprehensive interfaces and IntelliSense support
- **⚡ High Performance**: Optimized data structures (**~135KB bundle size**)
- **🌐 Universal Support**: Works in Node.js, browsers, and modern JavaScript environments
- **🔧 Validation Tools**: Built-in data integrity checks and format validation
- **📊 Rich Metadata**: Geographic coordinates, hierarchical relationships, and user-friendly codes
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
  { "code": "RW-01", "name": "Kigali City", "slug": "kigali-city" },
  { "code": "RW-02", "name": "Southern Province", "slug": "southern-province" },
  { "code": "RW-03", "name": "Western Province", "slug": "western-province" },
  { "code": "RW-04", "name": "Northern Province", "slug": "northern-province" },
  { "code": "RW-05", "name": "Eastern Province", "slug": "eastern-province" }
]
```

### Hierarchical Navigation

```ts
// Get districts in Kigali City
const kigaliDistricts = getDistrictsByProvince('RW-01');

// Get a specific administrative unit
const gasabo = getByCode('RW-D-01');

// Get complete hierarchy for any location
const hierarchy = getHierarchy('RW-V-00001');
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
| **Provinces** | 5 | `RW-01` | Kigali City |
| **Districts** | 30 | `RW-D-01` | Gasabo |
| **Sectors** | 416 | `RW-S-001` | Bumbogo |
| **Cells** | 2,148 | `RW-C-0001` | Bumbogo |
| **Villages** | 14,837 | `RW-V-00001` | Bumbogo |

**Total: 17,436 administrative units**

## 🔧 API Reference

### 📊 Core Data Functions
<details>
<summary><strong>🔄 Data Retrieval Functions</strong></summary>

```ts
getAllProvinces(): Province[]
getAllDistricts(): District[]
getAllSectors(): Sector[]
getAllCells(): Cell[]
getAllVillages(): Village[]
```
</details>

### 🗺️ Hierarchical Navigation
<details>
<summary><strong>🔗 Parent-Child Relationships</strong></summary>

```ts
getDistrictsByProvince(provinceCode: string): District[]
getSectorsByDistrict(districtCode: string): Sector[]
getCellsBySector(sectorCode: string): Cell[]
getVillagesByCell(cellCode: string): Village[]
```
</details>
<details>
<summary><strong>🎯 Direct Access & Hierarchy</strong></summary>

```ts
getByCode(code: string): AdministrativeUnit | undefined
getHierarchy(code: string): AdministrativeUnit[]
getFullHierarchy(code: string): AdministrativeUnit[]
getDirectChildren(parentCode: string): AdministrativeUnit[]
getSiblings(code: string): AdministrativeUnit[]
getAllDescendants(parentCode: string): AdministrativeUnit[]
```
</details>

### 🔍 Search & Discovery
<details>
<summary><strong>🔎 Search Functions</strong></summary>

```ts
searchByName(name: string): AdministrativeUnit[]
searchBySlug(slug: string): AdministrativeUnit[]
fuzzySearchByName(query: string, threshold?: number, limit?: number): Array<{unit: AdministrativeUnit, score: number}>
searchByPartialCode(partialCode: string, limit?: number): AdministrativeUnit[]
getSuggestions(query: string, limit?: number): Array<{unit: AdministrativeUnit, type: 'exact' | 'fuzzy' | 'partial', matchField: 'name' | 'code' | 'slug'}>
```
</details>

### ⚙️ Utility Functions
<details>
<summary><strong>🛠️ Helper Functions</strong></summary>

```ts
getByLevel(level: AdminLevel): AdministrativeUnit[]
getCounts(): { provinces: number; districts: number; sectors: number; cells: number; villages: number }
getSummary(): { provinces: number; districts: number; sectors: number; cells: number; villages: number; total: number }
isValidCode(code: string): boolean
getCodeLevel(code: string): AdminLevel | undefined
```
</details>

### ✅ Validation Functions
<details>
<summary><strong>🔍 Data Validation</strong></summary>

```ts
validateCodeFormat(code: string): { isValid: boolean; error?: string; level?: string; format?: string }
validateParentChildRelationship(parentCode: string, childCode: string): { isValid: boolean; error?: string; parentLevel?: string; childLevel?: string }
validateHierarchyIntegrity(): { isValid: boolean; issues: Array<{type: string, message: string, code?: string}>; summary: { totalUnits: number; orphanedUnits: number; invalidParents: number; circularReferences: number; missingUnits: number } }
validateUnitProperties(unit: AdministrativeUnit): { isValid: boolean; issues: string[] }
```
</details>

---

### 📋 Quick Reference
| Type | Description | Example |
|------|-------------|---------|
| `string` | Administrative code or name | `'RW-D-01'`, `'Gasabo'` |
| `number` | Threshold (0-1) or limit | `0.8`, `10` |
| `AdminLevel` | Administrative level | `'district'` |

| Type | Description |
|------|-------------|
| `AdministrativeUnit` | Base unit with `{code, name, slug, parentCode?, center?}` |
| `Province[]` | Array of province units |
| `District[]` | Array of district units |
| `Sector[]` | Array of sector units |
| `Cell[]` | Array of cell units |
| `Village[]` | Array of village units |

## 🏷️ Code Format & Data Structure

### Code Format
Each administrative unit has a unique hierarchical code:
- **Province**: `RW-XX` (e.g., `RW-01` for Kigali City)
- **District**: `RW-D-XX` (e.g., `RW-D-01` for Gasabo)
- **Sector**: `RW-S-XXX` (e.g., `RW-S-001` for Bumbogo)
- **Cell**: `RW-C-XXXX` (e.g., `RW-C-0001` for Bumbogo cell)
- **Village**: `RW-V-XXXXX` (e.g., `RW-V-00001` for Bumbogo village)

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

## 📁 Source Data Management

This package uses a compressed source file (`locations.json.gz`) to generate the administrative data. The source file is automatically managed and only loaded when needed.

### Managing the Source File

```bash
# Check current status
node scripts/manage-locations.js status

# Download fresh source data
node scripts/manage-locations.js download

# Compress the source file
node scripts/manage-locations.js compress

# Extract for development
node scripts/manage-locations.js extract

# Clean up (production mode)
node scripts/manage-locations.js clean
```

**Production Mode**: Only the compressed `locations.json.gz` file is kept (72KB), reducing storage and improving performance.

**Development Mode**: Both compressed and uncompressed files are available for easier debugging.

## 🛠️ Development

### Code Quality
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## 🚀 Automatic Publishing

This project uses GitHub Actions for automatic npm publishing and version management.

### How It Works
- Every push to the `main` branch triggers the auto-publish workflow
- The workflow analyzes commit messages to determine version bump type:
  - `BREAKING CHANGE:` or `major:` → Major version (1.0.0 → 2.0.0)
  - `feat:` or `feature:` → Minor version (1.0.0 → 1.1.0)
  - Everything else → Patch version (1.0.0 → 1.0.1)
- Automatically creates git tags and publishes to npm
- Skips publishing if no changes detected since last tag

### Requirements
- `NPM_TOKEN` secret must be configured in GitHub repository settings
- Repository must have write permissions for the workflow to create tags

## 📂 Project Structure
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
- Original data structure source: [jnkindi/rwanda-locations-json](https://github.com/jnkindi/rwanda-locations-json)
- Built with TypeScript for type safety and developer experience
- Optimized for performance and bundle size

## 📞 Support
- 📧 **Email**: e.monehin@live.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/monehin/rwanda-geo/issues)
- 📖 **Documentation**: [Full API Reference](https://github.com/monehin/rwanda-geo#api-reference)

---

**Made with ❤️ for Rwanda's digital transformation**