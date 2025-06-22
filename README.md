# rwanda-geo

> Reliable, typed, and lightweight dataset of Rwanda's full administrative divisions — from provinces to villages — with geospatial support for mapping and data analysis.

## Features
- Typed JSON datasets for all administrative levels (provinces, districts, sectors, cells, villages)
- GeoJSON boundaries for mapping (provinces, districts)
- TypeScript types and helper functions for easy querying
- ESM + CommonJS support
- Tree-shakable, lightweight, and MIT licensed
- Complete hierarchical relationships with parent-child links
- Both English and Kinyarwanda names for provinces

## Data Source
This package uses data extracted from `locations.json`, which contains the complete administrative hierarchy of Rwanda with:
- **5 Provinces** (Kigali City, Southern, Western, Northern, Eastern)
- **30 Districts**
- **416 Sectors**
- **2,148 Cells**
- **14,837 Villages** (official count)

## Installation
```bash
npm install rwanda-geo
```

## Usage
```ts
import { getAllProvinces, getDistrictsByProvince, getByCode, getHierarchy, GeoUnit } from 'rwanda-geo';

const provinces = getAllProvinces();
const districts = getDistrictsByProvince('RW-KG');
const unit = getByCode('RW-KG-GAS');
const hierarchy = getHierarchy('RW-KG-GAS-BUM-BUM-BUM');
```

## API
- `getAllProvinces(): Province[]`
- `getAllDistricts(): District[]`
- `getAllSectors(): Sector[]`
- `getAllCells(): Cell[]`
- `getAllVillages(): Village[]`
- `getDistrictsByProvince(code: string): District[]`
- `getSectorsByDistrict(code: string): Sector[]`
- `getCellsBySector(code: string): Cell[]`
- `getVillagesByCell(code: string): Village[]`
- `getByCode(code: string): GeoUnit | undefined`
- `getHierarchy(code: string): GeoUnit[]`
- `getChildren(parentCode: string): GeoUnit[]`
- `searchByName(query: string): GeoUnit[]`
- `searchBySlug(slug: string): GeoUnit[]`
- `getByLevel(level: string): GeoUnit[]`
- `getCounts(): Counts`

## TODO
- Provide GeoJSON `FeatureCollection` for all administrative levels (not just provinces/districts)
- Use correct and authoritative center point for all units (province, district, sector, cell, village)

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