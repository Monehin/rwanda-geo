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
  { "code": "RW-UMU", "name": "Umujyi wa Kigali", "slug": "umujyi-wa-kigali" },
  { "code": "RW-AMA", "name": "Amajyepfo", "slug": "amajyepfo" },
  { "code": "RW-IBU", "name": "Iburengerazuba", "slug": "iburengerazuba" },
  { "code": "RW-AMA-4", "name": "Amajyaruguru", "slug": "amajyaruguru" },
  { "code": "RW-IBU-5", "name": "Iburasirazuba", "slug": "iburasirazuba" }
]
*/

console.log('\n---\n');

// Get districts in Kigali City
const kigaliDistricts = getDistrictsByProvince('RW-UMU');
console.log('Districts in Kigali City:');
console.log(JSON.stringify(kigaliDistricts, null, 2));

/*
Output:
[
  { "code": "RW-UMU-NYA", "name": "Nyarugenge", "parentCode": "RW-UMU" },
  { "code": "RW-UMU-GAS", "name": "Gasabo", "parentCode": "RW-UMU" },
  { "code": "RW-UMU-KIC", "name": "Kicukiro", "parentCode": "RW-UMU" }
]
*/

console.log('\n---\n');

// Get a specific unit by code
const gasabo = getByCode('RW-UMU-GAS');
console.log('Gasabo District Details:');
console.log(JSON.stringify(gasabo, null, 2));

/*
Output:
{
  "code": "RW-UMU-GAS",
  "name": "Gasabo",
  "slug": "gasabo",
  "parentCode": "RW-UMU",
  "center": { "lat": 0, "lng": 0 }
}
*/

console.log('\n---\n');

// Get full hierarchy for a village
const hierarchy = getHierarchy('RW-UMU-GAS-BUM-BUM-BUM');
console.log('Hierarchy for Village RW-UMU-GAS-BUM-BUM-BUM:');
console.log(JSON.stringify(hierarchy, null, 2));

/*
Output:
[
  { "code": "RW-UMU", "name": "Umujyi wa Kigali" },
  { "code": "RW-UMU-GAS", "name": "Gasabo" },
  { "code": "RW-UMU-GAS-BUM", "name": "Bumbogo" },
  { "code": "RW-UMU-GAS-BUM-BUM", "name": "Bumbogo" },
  { "code": "RW-UMU-GAS-BUM-BUM-BUM", "name": "Bumbogo" }
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
const gasaboSectors = getSectorsByDistrict('RW-UMU-GAS');
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
const bumbogoCells = getCellsBySector('RW-UMU-GAS-BUM');
console.log(`   Total cells in Bumbogo: ${bumbogoCells.length}`);
bumbogoCells.forEach(cell => {
  console.log(`   ${cell.code}: ${cell.name}`);
});
console.log();

// 5. Get villages in Bumbogo cell
console.log('5. Villages in Bumbogo cell:');
const bumbogoVillages = getVillagesByCell('RW-UMU-GAS-BUM-BUM');
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