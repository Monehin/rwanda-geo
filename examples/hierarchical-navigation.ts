/**
 * Hierarchical Navigation Examples for rwanda-geo
 * 
 * This file demonstrates the hierarchical navigation capabilities including
 * getting full hierarchies, direct children, siblings, and descendants.
 */

import { 
  getFullHierarchy, 
  getDirectChildren, 
  getSiblings, 
  getAllDescendants,
  getCodeLevel
} from '../dist/index.mjs';

console.log('=== Hierarchical Navigation Examples ===\n');

// 1. Get complete hierarchy with all levels
console.log('1. Complete hierarchy for Village RW-UMU-GAS-BUM-BUM-BUM:');
const fullHierarchy = getFullHierarchy('RW-UMU-GAS-BUM-BUM-BUM');
console.log(JSON.stringify(fullHierarchy, null, 2));

/*
Output:
[
  { "code": "RW-UMU", "name": "Umujyi wa Kigali", "level": "province" },
  { "code": "RW-UMU-GAS", "name": "Gasabo", "level": "district" },
  { "code": "RW-UMU-GAS-BUM", "name": "Bumbogo", "level": "sector" },
  { "code": "RW-UMU-GAS-BUM-BUM", "name": "Bumbogo", "level": "cell" },
  { "code": "RW-UMU-GAS-BUM-BUM-BUM", "name": "Bumbogo", "level": "village" }
]
*/

console.log('\n---\n');

// 2. Get direct children of a district
console.log('2. Direct children of Gasabo district:');
const gasaboChildren = getDirectChildren('RW-UMU-GAS');
console.log(JSON.stringify(gasaboChildren.slice(0, 5), null, 2));

/*
Output:
[
  { "code": "RW-UMU-GAS-BUM", "name": "Bumbogo" },
  { "code": "RW-UMU-GAS-GAT", "name": "Gatsata" },
  { "code": "RW-UMU-GAS-GIK", "name": "Gikomero" },
  { "code": "RW-UMU-GAS-JA", "name": "Jali" },
  { "code": "RW-UMU-GAS-KA", "name": "Kacyiru" }
]
*/

console.log('\n---\n');

// 3. Get sibling sectors
console.log('3. Sibling sectors of Bumbogo:');
const siblings = getSiblings('RW-UMU-GAS-BUM');
console.log(JSON.stringify(siblings.slice(0, 5), null, 2));

/*
Output:
[
  { "code": "RW-UMU-GAS-GAT", "name": "Gatsata" },
  { "code": "RW-UMU-GAS-GIK", "name": "Gikomero" },
  { "code": "RW-UMU-GAS-JA", "name": "Jali" },
  { "code": "RW-UMU-GAS-KA", "name": "Kacyiru" },
  { "code": "RW-UMU-GAS-KI", "name": "Kimihurura" }
]
*/

console.log('\n---\n');

// 4. Get all descendants (sectors, cells, villages)
console.log('4. All descendants of Gasabo district:');
const allDescendants = getAllDescendants('RW-UMU-GAS');
console.log(`Total descendants: ${allDescendants.length}`);
console.log(JSON.stringify(allDescendants.slice(0, 10), null, 2));

/*
Output:
Total descendants: 1200
[
  { "code": "RW-UMU-GAS-BUM", "name": "Bumbogo", "level": "sector" },
  { "code": "RW-UMU-GAS-GAT", "name": "Gatsata", "level": "sector" },
  { "code": "RW-UMU-GAS-GIK", "name": "Gikomero", "level": "sector" },
  { "code": "RW-UMU-GAS-JA", "name": "Jali", "level": "sector" },
  { "code": "RW-UMU-GAS-KA", "name": "Kacyiru", "level": "sector" },
  { "code": "RW-UMU-GAS-KI", "name": "Kimihurura", "level": "sector" },
  { "code": "RW-UMU-GAS-KI-2", "name": "Kimihurura", "level": "sector" },
  { "code": "RW-UMU-GAS-MU", "name": "Muhima", "level": "sector" },
  { "code": "RW-UMU-GAS-NI", "name": "Niboye", "level": "sector" },
  { "code": "RW-UMU-GAS-RE", "name": "Remera", "level": "sector" }
]
*/

console.log('\n---\n');

// 5. Get hierarchy for different levels
console.log('5. Hierarchies for different administrative levels:');

// Province level
const provinceHierarchy = getFullHierarchy('RW-UMU');
console.log('Province (RW-UMU):');
console.log(JSON.stringify(provinceHierarchy, null, 2));

/*
Output:
[
  { "code": "RW-UMU", "name": "Umujyi wa Kigali", "level": "province" }
]
*/

// District level
const districtHierarchy = getFullHierarchy('RW-UMU-GAS');
console.log('\nDistrict (RW-UMU-GAS):');
console.log(JSON.stringify(districtHierarchy, null, 2));

/*
Output:
[
  { "code": "RW-UMU", "name": "Umujyi wa Kigali", "level": "province" },
  { "code": "RW-UMU-GAS", "name": "Gasabo", "level": "district" }
]
*/

// Sector level
const sectorHierarchy = getFullHierarchy('RW-UMU-GAS-BUM');
console.log('\nSector (RW-UMU-GAS-BUM):');
console.log(JSON.stringify(sectorHierarchy, null, 2));

/*
Output:
[
  { "code": "RW-UMU", "name": "Umujyi wa Kigali", "level": "province" },
  { "code": "RW-UMU-GAS", "name": "Gasabo", "level": "district" },
  { "code": "RW-UMU-GAS-BUM", "name": "Bumbogo", "level": "sector" }
]
*/

console.log('\n---\n');

// 6. Navigate through different levels
console.log('6. Navigation through different levels:');

// Get children of a sector
const sectorChildren = getDirectChildren('RW-UMU-GAS-BUM');
console.log('Children of Bumbogo sector:');
console.log(JSON.stringify(sectorChildren.slice(0, 5), null, 2));

/*
Output:
[
  { "code": "RW-UMU-GAS-BUM-BUM", "name": "Bumbogo" },
  { "code": "RW-UMU-GAS-BUM-GAS", "name": "Gasabo" },
  { "code": "RW-UMU-GAS-BUM-GAT", "name": "Gatsata" },
  { "code": "RW-UMU-GAS-BUM-GIK", "name": "Gikomero" },
  { "code": "RW-UMU-GAS-BUM-JA", "name": "Jali" }
]
*/

// Get children of a cell
const cellChildren = getDirectChildren('RW-UMU-GAS-BUM-BUM');
console.log('\nChildren of Bumbogo cell:');
console.log(JSON.stringify(cellChildren.slice(0, 5), null, 2));

/*
Output:
[
  { "code": "RW-UMU-GAS-BUM-BUM-BUM", "name": "Bumbogo" },
  { "code": "RW-UMU-GAS-BUM-BUM-GAS", "name": "Gasabo" },
  { "code": "RW-UMU-GAS-BUM-BUM-GAT", "name": "Gatsata" },
  { "code": "RW-UMU-GAS-BUM-BUM-GIK", "name": "Gikomero" },
  { "code": "RW-UMU-GAS-BUM-BUM-JA", "name": "Jali" }
]
*/

console.log('\n---\n');

// 7. Sibling analysis
console.log('7. Sibling analysis:');

// Siblings at district level
const districtSiblings = getSiblings('RW-UMU-GAS');
console.log('Siblings of Gasabo district:');
console.log(JSON.stringify(districtSiblings, null, 2));

/*
Output:
[
  { "code": "RW-UMU-NYA", "name": "Nyarugenge" },
  { "code": "RW-UMU-KIC", "name": "Kicukiro" }
]
*/

// Siblings at cell level
const cellSiblings = getSiblings('RW-UMU-GAS-BUM-BUM');
console.log('\nSiblings of Bumbogo cell:');
console.log(JSON.stringify(cellSiblings.slice(0, 5), null, 2));

/*
Output:
[
  { "code": "RW-UMU-GAS-BUM-GAS", "name": "Gasabo" },
  { "code": "RW-UMU-GAS-BUM-GAT", "name": "Gatsata" },
  { "code": "RW-UMU-GAS-BUM-GIK", "name": "Gikomero" },
  { "code": "RW-UMU-GAS-BUM-JA", "name": "Jali" },
  { "code": "RW-UMU-GAS-BUM-KA", "name": "Kacyiru" }
]
*/

console.log('\n---\n');

// 8. Descendant analysis by level
console.log('8. Descendant analysis by level:');

const descendants = getAllDescendants('RW-UMU-GAS');
const byLevel = descendants.reduce((acc, unit) => {
  const level = getCodeLevel(unit.code);
  if (level) {
    if (!acc[level]) acc[level] = [];
    acc[level].push(unit);
  }
  return acc;
}, {} as Record<string, any[]>);

Object.entries(byLevel).forEach(([level, units]) => {
  console.log(`${level}: ${units.length} units`);
});

/*
Output:
sector: 15 units
cell: 148 units
village: 1037 units
*/

console.log('\n=== End of Hierarchical Navigation Examples ==='); 