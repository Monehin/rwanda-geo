/**
 * Hierarchical Navigation Examples for rwanda-geo
 * 
 * This file demonstrates the hierarchical navigation capabilities
 * including parent-child relationships, siblings, and descendants.
 */

import {
  getHierarchy,
  getFullHierarchy,
  getDirectChildren,
  getSiblings,
  getByCode,
  searchByPartialCode,
  getCodeLevel
} from '../dist/index.mjs';

console.log('=== Hierarchical Navigation Examples ===\n');

// 1. Complete hierarchy for a village
console.log('1. Complete hierarchy for Village RW-V-00001:');
const fullHierarchy = getFullHierarchy('RW-V-00001');
console.log(JSON.stringify(fullHierarchy, null, 2));

/*
Output:
[
  { "code": "RW-01", "name": "Kigali City", "level": "province" },
  { "code": "RW-D-01", "name": "Gasabo", "level": "district" },
  { "code": "RW-S-001", "name": "Bumbogo", "level": "sector" },
  { "code": "RW-C-0001", "name": "Bumbogo", "level": "cell" },
  { "code": "RW-V-00001", "name": "Bumbogo", "level": "village" }
]
*/

console.log('\n---\n');

// 2. Direct children of a province
console.log('2. Direct children (districts) of Kigali City:');
const kigaliChildren = getDirectChildren('RW-01');
console.log(JSON.stringify(kigaliChildren, null, 2));

/*
Output:
[
  { "code": "RW-D-01", "name": "Gasabo", "level": "district" },
  { "code": "RW-D-02", "name": "Kicukiro", "level": "district" },
  { "code": "RW-D-03", "name": "Nyarugenge", "level": "district" }
]
*/

console.log('\n---\n');

// 3. Siblings of a district
console.log('3. Siblings of Gasabo district:');
const gasaboSiblings = getSiblings('RW-D-01');
console.log(JSON.stringify(gasaboSiblings, null, 2));

/*
Output:
[
  { "code": "RW-D-02", "name": "Kicukiro", "level": "district" },
  { "code": "RW-D-03", "name": "Nyarugenge", "level": "district" }
]
*/

console.log('\n---\n');

// 4. All descendants of a province
console.log('4. All descendants of Kigali City (summary):');
const kigaliDescendants = searchByPartialCode('RW-01', 1000);
console.log(`   Total descendants: ${kigaliDescendants.length}`);
console.log(`   Districts: ${kigaliDescendants.filter(d => getCodeLevel(d.code) === 'district').length}`);
console.log(`   Sectors: ${kigaliDescendants.filter(d => getCodeLevel(d.code) === 'sector').length}`);
console.log(`   Cells: ${kigaliDescendants.filter(d => getCodeLevel(d.code) === 'cell').length}`);
console.log(`   Villages: ${kigaliDescendants.filter(d => getCodeLevel(d.code) === 'village').length}`);

console.log('\n---\n');

// 5. Breadcrumb navigation
console.log('5. Breadcrumb navigation for a village:');
const village = getByCode('RW-V-00001');
if (village) {
  const breadcrumbs = getHierarchy(village.code);
  console.log('Breadcrumbs:');
  breadcrumbs.forEach((crumb, index) => {
    const separator = index < breadcrumbs.length - 1 ? ' > ' : '';
    process.stdout.write(`${crumb.name}${separator}`);
  });
  console.log('\n');
}

console.log('\n---\n');

// 6. Tree structure visualization
console.log('6. Tree structure for Kigali City:');
const kigaliTree = getDirectChildren('RW-01');
console.log('Kigali City');
kigaliTree.forEach(district => {
  console.log(`├── ${district.name} (${district.code})`);
  const sectors = getDirectChildren(district.code);
  sectors.slice(0, 3).forEach((sector, index) => {
    const isLast = index === sectors.length - 1 || index === 2;
    const prefix = isLast ? '└── ' : '├── ';
    console.log(`│   ${prefix}${sector.name} (${sector.code})`);
  });
  if (sectors.length > 3) {
    console.log(`│   └── ... and ${sectors.length - 3} more sectors`);
  }
});

console.log('\n---\n');

// 7. Navigation path finding
console.log('7. Navigation path between two units:');
const startUnit = getByCode('RW-D-01'); // Gasabo district
const endUnit = getByCode('RW-V-00001'); // Bumbogo village

if (startUnit && endUnit) {
  const startHierarchy = getHierarchy(startUnit.code);
  const endHierarchy = getHierarchy(endUnit.code);
  
  console.log(`Path from ${startUnit.name} to ${endUnit.name}:`);
  
  // Find common ancestor
  let commonAncestor: any = null;
  for (let i = 0; i < Math.min(startHierarchy.length, endHierarchy.length); i++) {
    if (startHierarchy[i].code === endHierarchy[i].code) {
      commonAncestor = startHierarchy[i];
    } else {
      break;
    }
  }
  
  if (commonAncestor) {
    console.log(`   Common ancestor: ${commonAncestor.name}`);
    
    // Path down to target
    const targetIndex = endHierarchy.findIndex(h => h.code === endUnit.code);
    if (targetIndex !== -1) {
      const pathToTarget = endHierarchy.slice(targetIndex);
      console.log(`   Path to target: ${pathToTarget.map(h => h.name).join(' > ')}`);
    }
  }
}

console.log('\n---\n');

// 8. Hierarchical statistics
console.log('8. Hierarchical statistics for all provinces:');
import { getAllProvinces } from '../dist/index.mjs';

const provinces = getAllProvinces();
provinces.forEach(province => {
  const descendants = searchByPartialCode(province.code, 1000);
  const districts = descendants.filter(d => getCodeLevel(d.code) === 'district').length;
  const sectors = descendants.filter(d => getCodeLevel(d.code) === 'sector').length;
  const cells = descendants.filter(d => getCodeLevel(d.code) === 'cell').length;
  const villages = descendants.filter(d => getCodeLevel(d.code) === 'village').length;
  
  console.log(`${province.name}:`);
  console.log(`   Districts: ${districts}`);
  console.log(`   Sectors: ${sectors}`);
  console.log(`   Cells: ${cells}`);
  console.log(`   Villages: ${villages}`);
  console.log(`   Total: ${descendants.length}`);
  console.log();
});

console.log('=== End of Hierarchical Navigation Examples ==='); 