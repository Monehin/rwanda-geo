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
} from '../dist/index.js';

console.log('=== Rwanda Geo Basic Usage Examples ===\n');

// 1. Get all administrative units at each level
console.log('1. Getting all units at each level:');
const provinces = getAllProvinces();
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

// 3. Get districts in Kigali City
console.log('3. Districts in Kigali City:');
const kigaliDistricts = getDistrictsByProvince('RW-UMU');
kigaliDistricts.forEach(district => {
  console.log(`   ${district.code}: ${district.name}`);
});
console.log();

// 4. Get sectors in Gasabo district
console.log('4. Sectors in Gasabo district:');
const gasaboSectors = getSectorsByDistrict('RW-UMU-GAS');
console.log(`   Total sectors in Gasabo: ${gasaboSectors.length}`);
gasaboSectors.slice(0, 5).forEach(sector => {
  console.log(`   ${sector.code}: ${sector.name}`);
});
if (gasaboSectors.length > 5) {
  console.log(`   ... and ${gasaboSectors.length - 5} more sectors`);
}
console.log();

// 5. Get cells in Bumbogo sector
console.log('5. Cells in Bumbogo sector:');
const bumbogoCells = getCellsBySector('RW-UMU-GAS-BUM');
console.log(`   Total cells in Bumbogo: ${bumbogoCells.length}`);
bumbogoCells.forEach(cell => {
  console.log(`   ${cell.code}: ${cell.name}`);
});
console.log();

// 6. Get villages in Bumbogo cell
console.log('6. Villages in Bumbogo cell:');
const bumbogoVillages = getVillagesByCell('RW-UMU-GAS-BUM-BUM');
console.log(`   Total villages in Bumbogo cell: ${bumbogoVillages.length}`);
bumbogoVillages.forEach(village => {
  console.log(`   ${village.code}: ${village.name}`);
});
console.log();

// 7. Get a specific unit by code
console.log('7. Getting specific units by code:');
const gasabo = getByCode('RW-UMU-GAS');
const bumbogo = getByCode('RW-UMU-GAS-BUM');
const bumbogoCell = getByCode('RW-UMU-GAS-BUM-BUM');
const bumbogoVillage = getByCode('RW-UMU-GAS-BUM-BUM-BUM');

console.log(`   Gasabo district: ${gasabo?.name} (${gasabo?.code})`);
console.log(`   Bumbogo sector: ${bumbogo?.name} (${bumbogo?.code})`);
console.log(`   Bumbogo cell: ${bumbogoCell?.name} (${bumbogoCell?.code})`);
console.log(`   Bumbogo village: ${bumbogoVillage?.name} (${bumbogoVillage?.code})`);
console.log();

// 8. Get hierarchy for a village
console.log('8. Complete hierarchy for Bumbogo village:');
const hierarchy = getHierarchy('RW-UMU-GAS-BUM-BUM-BUM');
console.log('   Hierarchy chain:');
hierarchy.forEach((unit, index) => {
  const indent = '   '.repeat(index + 1);
  console.log(`${indent}${unit.name} (${unit.code})`);
});
console.log();

// 9. Get summary statistics
console.log('9. Summary statistics:');
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