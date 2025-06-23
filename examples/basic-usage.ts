/**
 * Basic Usage Examples for rwanda-geo
 * 
 * This file demonstrates the fundamental operations available in the package.
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
  getHierarchy,
  getSummary
} from '../dist/index.mjs';

console.log('=== Basic Usage Examples ===\n');

// Get all provinces
const provinces = getAllProvinces();
console.log('All Provinces:');
console.log(JSON.stringify(provinces, null, 2));

/*
Output:
[
  { "code": "RW-01", "name": "Kigali City", "slug": "kigali-city" },
  { "code": "RW-02", "name": "Southern Province", "slug": "southern-province" },
  { "code": "RW-03", "name": "Western Province", "slug": "western-province" },
  { "code": "RW-04", "name": "Northern Province", "slug": "northern-province" },
  { "code": "RW-05", "name": "Eastern Province", "slug": "eastern-province" }
]
*/

console.log('\n---\n');

// Get districts in Kigali City
const kigaliDistricts = getDistrictsByProvince('RW-01');
console.log('Districts in Kigali City:');
console.log(JSON.stringify(kigaliDistricts, null, 2));

/*
Output:
[
  { "code": "RW-D-01", "name": "Gasabo", "parentCode": "RW-01" },
  { "code": "RW-D-02", "name": "Kicukiro", "parentCode": "RW-01" },
  { "code": "RW-D-03", "name": "Nyarugenge", "parentCode": "RW-01" }
]
*/

console.log('\n---\n');

// Get a specific unit by code
const gasabo = getByCode('RW-D-01');
console.log('Gasabo District Details:');
console.log(JSON.stringify(gasabo, null, 2));

/*
Output:
{
  "code": "RW-D-01",
  "name": "Gasabo",
  "slug": "gasabo",
  "parentCode": "RW-01",
  "center": { "lat": 0, "lng": 0 }
}
*/

console.log('\n---\n');

// Get full hierarchy for a village
const hierarchy = getHierarchy('RW-V-00001');
console.log('Hierarchy for Village RW-V-00001:');
console.log(JSON.stringify(hierarchy, null, 2));

/*
Output:
[
  { "code": "RW-01", "name": "Kigali City" },
  { "code": "RW-D-01", "name": "Gasabo" },
  { "code": "RW-S-001", "name": "Bumbogo" },
  { "code": "RW-C-0001", "name": "Bumbogo" },
  { "code": "RW-V-00001", "name": "Bumbogo" }
]
*/

// 1. Get all administrative units at each level
console.log('1. Getting all units at each level:');
const districts = getAllDistricts();
const sectors = getAllSectors();
const cells = getAllCells();
const villages = getAllVillages();

console.log(`   Provinces: ${provinces.length}`);
console.log(`   Districts: ${districts.length}`);
console.log(`   Sectors: ${sectors.length}`);
console.log(`   Cells: ${cells.length}`);
console.log(`   Villages: ${villages.length}\n`);

// 2. Display all provinces
console.log('2. All provinces in Rwanda:');
provinces.forEach(province => {
  console.log(`   ${province.code}: ${province.name}`);
});
console.log();

// 3. Get sectors in Gasabo district
console.log('3. Sectors in Gasabo district:');
const gasaboSectors = getSectorsByDistrict('RW-D-01');
console.log(`   Total sectors in Gasabo: ${gasaboSectors.length}`);
gasaboSectors.slice(0, 5).forEach(sector => {
  console.log(`   ${sector.code}: ${sector.name}`);
});
if (gasaboSectors.length > 5) {
  console.log(`   ... and ${gasaboSectors.length - 5} more sectors`);
}
console.log();

// 4. Get cells in Bumbogo sector
console.log('4. Cells in Bumbogo sector:');
const bumbogoCells = getCellsBySector('RW-S-001');
console.log(`   Total cells in Bumbogo: ${bumbogoCells.length}`);
bumbogoCells.forEach(cell => {
  console.log(`   ${cell.code}: ${cell.name}`);
});
console.log();

// 5. Get villages in Bumbogo cell
console.log('5. Villages in Bumbogo cell:');
const bumbogoVillages = getVillagesByCell('RW-C-0001');
console.log(`   Total villages in Bumbogo cell: ${bumbogoVillages.length}`);
bumbogoVillages.forEach(village => {
  console.log(`   ${village.code}: ${village.name}`);
});
console.log();

// 7. Get summary statistics
console.log('7. Summary statistics:');
const summary = getSummary();
const total = summary.provinces + summary.districts + summary.sectors + summary.cells + summary.villages;
console.log(`   Total administrative units: ${total}`);
console.log(`   Provinces: ${summary.provinces}`);
console.log(`   Districts: ${summary.districts}`);
console.log(`   Sectors: ${summary.sectors}`);
console.log(`   Cells: ${summary.cells}`);
console.log(`   Villages: ${summary.villages}`);
console.log();

// 10. Calculate averages
console.log('10. Average calculations:');
const avgDistrictsPerProvince = summary.districts / summary.provinces;
const avgSectorsPerDistrict = summary.sectors / summary.districts;
const avgCellsPerSector = summary.cells / summary.sectors;
const avgVillagesPerCell = summary.villages / summary.cells;

console.log(`   Average districts per province: ${avgDistrictsPerProvince.toFixed(1)}`);
console.log(`   Average sectors per district: ${avgSectorsPerDistrict.toFixed(1)}`);
console.log(`   Average cells per sector: ${avgCellsPerSector.toFixed(1)}`);
console.log(`   Average villages per cell: ${avgVillagesPerCell.toFixed(1)}`);
console.log();

// 11. Province breakdown
console.log('11. Province breakdown:');
provinces.forEach(province => {
  const provinceDistricts = getDistrictsByProvince(province.code);
  const totalSectors = provinceDistricts.reduce((sum, district) => {
    return sum + getSectorsByDistrict(district.code).length;
  }, 0);
  
  console.log(`   ${province.name}:`);
  console.log(`     Districts: ${provinceDistricts.length}`);
  console.log(`     Sectors: ${totalSectors}`);
});

console.log('\n=== End of Basic Usage Examples ==='); 