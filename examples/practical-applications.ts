/**
 * Practical Applications Examples for rwanda-geo
 * 
 * This file demonstrates real-world use cases including
 * location selectors, data analysis, reporting, and geographic visualization.
 */

import {
  getAllProvinces,
  getAllDistricts,
  getAllSectors,
  getAllCells,
  getAllVillages,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
  getByCode,
  getFullHierarchy,
  getSummary,
  fuzzySearchByName,
  getSuggestions,
  getCodeLevel
} from '../dist/index.js';

console.log('=== Rwanda Geo Practical Applications Examples ===\n');

// 1. Location Selector Component
console.log('1. Location Selector Component:');
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
    console.log(`   Selected province: ${getByCode(code)?.name}`);
  }

  selectDistrict(code: string) {
    this.selectedDistrict = code;
    this.selectedSector = undefined;
    this.selectedCell = undefined;
    console.log(`   Selected district: ${getByCode(code)?.name}`);
  }

  selectSector(code: string) {
    this.selectedSector = code;
    this.selectedCell = undefined;
    console.log(`   Selected sector: ${getByCode(code)?.name}`);
  }

  selectCell(code: string) {
    this.selectedCell = code;
    console.log(`   Selected cell: ${getByCode(code)?.name}`);
  }

  getCurrentSelection() {
    return {
      province: this.selectedProvince ? getByCode(this.selectedProvince) : null,
      district: this.selectedDistrict ? getByCode(this.selectedDistrict) : null,
      sector: this.selectedSector ? getByCode(this.selectedSector) : null,
      cell: this.selectedCell ? getByCode(this.selectedCell) : null,
      villages: this.getVillages()
    };
  }
}

// Demo the location selector
const selector = new LocationSelector();
selector.selectProvince('RW-KG');
selector.selectDistrict('RW-KG-GAS');
selector.selectSector('RW-KG-GAS-BUM');
selector.selectCell('RW-KG-GAS-BUM-BUM');

const selection = selector.getCurrentSelection();
console.log(`   Current selection:`);
console.log(`     Province: ${selection.province?.name}`);
console.log(`     District: ${selection.district?.name}`);
console.log(`     Sector: ${selection.sector?.name}`);
console.log(`     Cell: ${selection.cell?.name}`);
console.log(`     Villages: ${selection.villages.length} villages`);
console.log();

// 2. Search Autocomplete Component
console.log('2. Search Autocomplete Component:');
class SearchAutocomplete {
  private suggestions: Array<{ unit: any; type: string; matchField: string }> = [];

  search(query: string, limit: number = 10) {
    if (query.length < 2) {
      this.suggestions = [];
      return [];
    }

    this.suggestions = getSuggestions(query, limit);
    return this.suggestions;
  }

  getSuggestions() {
    return this.suggestions;
  }

  selectSuggestion(index: number) {
    if (index >= 0 && index < this.suggestions.length) {
      return this.suggestions[index].unit;
    }
    return null;
  }

  renderSuggestions() {
    return this.suggestions.map((suggestion, index) => ({
      id: index,
      name: suggestion.unit.name,
      code: suggestion.unit.code,
      level: getCodeLevel(suggestion.unit.code),
      type: suggestion.type,
      matchField: suggestion.matchField
    }));
  }
}

// Demo the search autocomplete
const autocomplete = new SearchAutocomplete();
const searchResults = autocomplete.search('bum', 5);
console.log(`   Search results for "bum":`);
searchResults.forEach((suggestion, index) => {
  console.log(`     ${index + 1}. ${suggestion.unit.name} (${suggestion.unit.code}) - ${suggestion.type} match on ${suggestion.matchField}`);
});
console.log();

// 3. Data Analysis and Reporting
console.log('3. Data Analysis and Reporting:');
function generateAdministrativeReport() {
  const summary = getSummary();
  const provinces = getAllProvinces();
  const districts = getAllDistricts();

  console.log('   Rwanda Administrative Report');
  console.log('   ============================');
  console.log(`   Total Administrative Units: ${summary.provinces + summary.districts + summary.sectors + summary.cells + summary.villages}`);
  console.log(`   Provinces: ${summary.provinces}`);
  console.log(`   Districts: ${summary.districts}`);
  console.log(`   Sectors: ${summary.sectors}`);
  console.log(`   Cells: ${summary.cells}`);
  console.log(`   Villages: ${summary.villages}`);

  // Calculate averages
  const avgDistrictsPerProvince = summary.districts / summary.provinces;
  const avgSectorsPerDistrict = summary.sectors / summary.districts;
  const avgCellsPerSector = summary.cells / summary.sectors;
  const avgVillagesPerCell = summary.villages / summary.cells;

  console.log('\n   Averages:');
  console.log(`   Average districts per province: ${avgDistrictsPerProvince.toFixed(1)}`);
  console.log(`   Average sectors per district: ${avgSectorsPerDistrict.toFixed(1)}`);
  console.log(`   Average cells per sector: ${avgCellsPerSector.toFixed(1)}`);
  console.log(`   Average villages per cell: ${avgVillagesPerCell.toFixed(1)}`);

  // Province breakdown
  console.log('\n   Province Breakdown:');
  provinces.forEach(province => {
    const provinceDistricts = districts.filter(d => d.parentCode === province.code);
    const totalSectors = provinceDistricts.reduce((sum, district) => {
      return sum + getSectorsByDistrict(district.code).length;
    }, 0);
    
    console.log(`   ${province.name}:`);
    console.log(`     Districts: ${provinceDistricts.length}`);
    console.log(`     Sectors: ${totalSectors}`);
  });
}

generateAdministrativeReport();
console.log();

// 4. Geographic Visualization Helper
console.log('4. Geographic Visualization Helper:');
function createMapVisualization(code: string) {
  const hierarchy = getFullHierarchy(code);
  const targetUnit = getByCode(code);
  
  if (!targetUnit) {
    console.log(`   ❌ Unit not found: ${code}`);
    return null;
  }

  // Create breadcrumb navigation
  const breadcrumb = hierarchy.map(unit => ({
    name: unit.name,
    code: unit.code,
    level: getCodeLevel(unit.code)
  }));

  // Get geographic center if available
  const center = targetUnit.center;
  
  // Example for mapping libraries
  const mapConfig = {
    center: center ? { lat: center.lat, lng: center.lng } : null,
    zoom: getZoomLevel(targetUnit.code),
    bounds: calculateBounds(hierarchy),
    markers: hierarchy.map(unit => ({
      position: unit.center,
      title: unit.name,
      level: getCodeLevel(unit.code)
    }))
  };

  return {
    unit: targetUnit,
    hierarchy: breadcrumb,
    mapConfig,
    center
  };
}

function getZoomLevel(code: string): number {
  const level = getCodeLevel(code);
  const zoomLevels: Record<string, number> = {
    'province': 8,
    'district': 10,
    'sector': 12,
    'cell': 14,
    'village': 16
  };
  return zoomLevels[level] || 10;
}

function calculateBounds(hierarchy: any[]): any {
  // Simplified bounds calculation
  const unitsWithCenter = hierarchy.filter(unit => unit.center);
  if (unitsWithCenter.length === 0) return null;

  const lats = unitsWithCenter.map(u => u.center.lat);
  const lngs = unitsWithCenter.map(u => u.center.lng);

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs)
  };
}

// Demo geographic visualization
const mapData = createMapVisualization('RW-KG-GAS-BUM-BUM-BUM');
if (mapData) {
  console.log(`   Map visualization for ${mapData.unit.name}:`);
  console.log(`     Zoom level: ${mapData.mapConfig.zoom}`);
  console.log(`     Center: ${mapData.center ? `${mapData.center.lat}, ${mapData.center.lng}` : 'Not available'}`);
  console.log(`     Hierarchy levels: ${mapData.hierarchy.length}`);
  console.log(`     Markers: ${mapData.mapConfig.markers.length}`);
}
console.log();

// 5. Data Export and Integration
console.log('5. Data Export and Integration:');
function exportLocationData(format: 'json' | 'csv' | 'geojson' = 'json') {
  const provinces = getAllProvinces();
  const districts = getAllDistricts();
  const sectors = getAllSectors();
  const cells = getAllCells();
  const villages = getAllVillages();

  switch (format) {
    case 'json': {
      return {
        metadata: {
          totalUnits: provinces.length + districts.length + sectors.length + cells.length + villages.length,
          lastUpdated: new Date().toISOString(),
          source: 'rwanda-geo'
        },
        data: {
          provinces,
          districts,
          sectors,
          cells,
          villages
        }
      };
    }

    case 'csv': {
      const csvData = [
        ['code', 'name', 'slug', 'parentCode', 'level', 'lat', 'lng'],
        ...provinces.map(p => [p.code, p.name, p.slug, '', 'province', p.center?.lat || '', p.center?.lng || '']),
        ...districts.map(d => [d.code, d.name, d.slug, d.parentCode, 'district', d.center?.lat || '', d.center?.lng || '']),
        ...sectors.map(s => [s.code, s.name, s.slug, s.parentCode, 'sector', s.center?.lat || '', s.center?.lng || '']),
        ...cells.map(c => [c.code, c.name, c.slug, c.parentCode, 'cell', c.center?.lat || '', c.center?.lng || '']),
        ...villages.map(v => [v.code, v.name, v.slug, v.parentCode, 'village', v.center?.lat || '', v.center?.lng || ''])
      ];
      return csvData.map(row => row.join(',')).join('\n');
    }

    case 'geojson': {
      return {
        type: 'FeatureCollection',
        features: [
          ...provinces.map(p => createGeoJSONFeature(p, 'province')),
          ...districts.map(d => createGeoJSONFeature(d, 'district')),
          ...sectors.map(s => createGeoJSONFeature(s, 'sector')),
          ...cells.map(c => createGeoJSONFeature(c, 'cell')),
          ...villages.map(v => createGeoJSONFeature(v, 'village'))
        ]
      };
    }
  }
}

function createGeoJSONFeature(unit: any, level: string) {
  return {
    type: 'Feature',
    properties: {
      code: unit.code,
      name: unit.name,
      slug: unit.slug,
      parentCode: unit.parentCode,
      level: level
    },
    geometry: unit.center ? {
      type: 'Point',
      coordinates: [unit.center.lng, unit.center.lat]
    } : null
  };
}

// Demo data export
const jsonExport = exportLocationData('json');
const csvExport = exportLocationData('csv');
const geojsonExport = exportLocationData('geojson');

console.log(`   Data export examples:`);
console.log(`     JSON: ${jsonExport.metadata.totalUnits} units exported`);
console.log(`     CSV: ${csvExport.split('\n').length - 1} rows (including header)`);
console.log(`     GeoJSON: ${geojsonExport.features.length} features`);
console.log();

// 6. Performance Monitoring
console.log('6. Performance Monitoring:');
function benchmarkOperations() {
  const operations = [
    { name: 'Get all provinces', fn: () => getAllProvinces() },
    { name: 'Get all districts', fn: () => getAllDistricts() },
    { name: 'Get all sectors', fn: () => getAllSectors() },
    { name: 'Get all cells', fn: () => getAllCells() },
    { name: 'Get all villages', fn: () => getAllVillages() },
    { name: 'Fuzzy search "kigali"', fn: () => fuzzySearchByName('kigali', 3, 10) },
    { name: 'Get hierarchy for village', fn: () => getFullHierarchy('RW-KG-GAS-BUM-BUM-BUM') },
    { name: 'Get suggestions "bum"', fn: () => getSuggestions('bum', 10) }
  ];

  console.log(`   Performance benchmarks (100 iterations each):`);
  operations.forEach(op => {
    const start = Date.now();
    for (let i = 0; i < 100; i++) {
      op.fn();
    }
    const end = Date.now();
    const avgTime = (end - start) / 100;
    console.log(`     ${op.name}: ${avgTime.toFixed(2)}ms average`);
  });
}

benchmarkOperations();
console.log();

console.log('=== End of Practical Applications Examples ==='); 