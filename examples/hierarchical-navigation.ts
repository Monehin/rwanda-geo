/**
 * Hierarchical Navigation Examples for rwanda-geo
 * 
 * This file demonstrates the hierarchical navigation capabilities including
 * parent-child relationships, siblings, descendants, and full hierarchy traversal.
 */

import {
  getFullHierarchy,
  getDirectChildren,
  getSiblings,
  getAllDescendants,
  getHierarchy,
  getByCode,
  getCodeLevel
} from '../dist/index.js';

console.log('=== Rwanda Geo Hierarchical Navigation Examples ===\n');

// 1. Full hierarchy for a village
console.log('1. Full hierarchy for Bumbogo village:');
const villageHierarchy = getFullHierarchy('RW-KG-GAS-BUM-BUM-BUM');
console.log('   Complete hierarchy chain:');
villageHierarchy.forEach((unit, index) => {
  const level = getCodeLevel(unit.code);
  const indent = '   '.repeat(index + 1);
  console.log(`${indent}${unit.name} (${unit.code}) - Level: ${level}`);
});
console.log();

// 2. Direct children of Gasabo district
console.log('2. Direct children of Gasabo district:');
const gasaboChildren = getDirectChildren('RW-KG-GAS');
console.log(`   Gasabo has ${gasaboChildren.length} sectors:`);
gasaboChildren.forEach(sector => {
  console.log(`   ${sector.name} (${sector.code})`);
});
console.log();

// 3. Siblings of Bumbogo sector
console.log('3. Siblings of Bumbogo sector:');
const bumbogoSiblings = getSiblings('RW-KG-GAS-BUM');
console.log(`   Bumbogo has ${bumbogoSiblings.length} sibling sectors in Gasabo:`);
bumbogoSiblings.slice(0, 5).forEach(sector => {
  console.log(`   ${sector.name} (${sector.code})`);
});
if (bumbogoSiblings.length > 5) {
  console.log(`   ... and ${bumbogoSiblings.length - 5} more sectors`);
}
console.log();

// 4. All descendants of Gasabo district
console.log('4. All descendants of Gasabo district:');
const gasaboDescendants = getAllDescendants('RW-KG-GAS');
console.log(`   Gasabo has ${gasaboDescendants.length} total descendants:`);

// Group by level
const byLevel = gasaboDescendants.reduce((acc, unit) => {
  const level = getCodeLevel(unit.code);
  if (level) {
    if (!acc[level]) acc[level] = [];
    acc[level].push(unit);
  }
  return acc;
}, {} as Record<string, any[]>);

Object.entries(byLevel).forEach(([level, units]) => {
  console.log(`   ${level}s: ${units.length}`);
});
console.log();

// 5. Hierarchy comparison between different levels
console.log('5. Hierarchy comparison between different levels:');
const testCodes = [
  'RW-KG',           // Province
  'RW-KG-GAS',       // District
  'RW-KG-GAS-BUM',   // Sector
  'RW-KG-GAS-BUM-BUM', // Cell
  'RW-KG-GAS-BUM-BUM-BUM' // Village
];

testCodes.forEach(code => {
  const unit = getByCode(code);
  const hierarchy = getHierarchy(code);
  const level = getCodeLevel(code);
  
  console.log(`   ${unit?.name} (${code}):`);
  console.log(`     Level: ${level}`);
  console.log(`     Hierarchy depth: ${hierarchy.length}`);
  console.log(`     Hierarchy: ${hierarchy.map(u => u.name).join(' → ')}`);
});
console.log();

// 6. Breadcrumb navigation example
console.log('6. Breadcrumb navigation example:');
function createBreadcrumb(code: string) {
  const hierarchy = getFullHierarchy(code);
  return hierarchy.map((unit, index) => ({
    name: unit.name,
    code: unit.code,
    level: getCodeLevel(unit.code),
    isLast: index === hierarchy.length - 1
  }));
}

const breadcrumb = createBreadcrumb('RW-KG-GAS-BUM-BUM-BUM');
console.log('   Breadcrumb for Bumbogo village:');
breadcrumb.forEach((item, index) => {
  const separator = index < breadcrumb.length - 1 ? ' > ' : '';
  console.log(`   ${item.name} (${item.level})${separator}`);
});
console.log();

// 7. Tree structure visualization
console.log('7. Tree structure for Gasabo district:');
function visualizeTree(parentCode: string, maxDepth: number = 3, currentDepth: number = 0) {
  if (currentDepth >= maxDepth) return;
  
  const children = getDirectChildren(parentCode);
  const parent = getByCode(parentCode);
  
  const indent = '   '.repeat(currentDepth);
  console.log(`${indent}${parent?.name} (${parentCode})`);
  
  children.slice(0, 3).forEach(child => {
    visualizeTree(child.code, maxDepth, currentDepth + 1);
  });
  
  if (children.length > 3) {
    const extraIndent = '   '.repeat(currentDepth + 1);
    console.log(`${extraIndent}... and ${children.length - 3} more`);
  }
}

visualizeTree('RW-KG-GAS', 3);
console.log();

// 8. Sibling analysis
console.log('8. Sibling analysis for different levels:');
const siblingTestCodes = [
  'RW-KG-GAS-BUM',   // Sector level
  'RW-KG-GAS-BUM-BUM', // Cell level
  'RW-KG-GAS-BUM-BUM-BUM' // Village level
];

siblingTestCodes.forEach(code => {
  const unit = getByCode(code);
  const siblings = getSiblings(code);
  const level = getCodeLevel(code);
  
  console.log(`   ${unit?.name} (${level} level):`);
  console.log(`     Has ${siblings.length} siblings`);
  if (siblings.length > 0) {
    console.log(`     Siblings: ${siblings.slice(0, 3).map(s => s.name).join(', ')}`);
    if (siblings.length > 3) {
      console.log(`     ... and ${siblings.length - 3} more`);
    }
  }
});
console.log();

// 9. Descendant statistics
console.log('9. Descendant statistics for each province:');
const provinces = ['RW-KG', 'RW-SO', 'RW-WE', 'RW-NO', 'RW-EA'];
provinces.forEach(provinceCode => {
  const province = getByCode(provinceCode);
  const descendants = getAllDescendants(provinceCode);
  
  // Group by level
  const levelCounts = descendants.reduce((acc, unit) => {
    const level = getCodeLevel(unit.code);
    if (level) {
      acc[level] = (acc[level] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`   ${province?.name}:`);
  console.log(`     Total descendants: ${descendants.length}`);
  Object.entries(levelCounts).forEach(([level, count]) => {
    console.log(`     ${level}s: ${count}`);
  });
});
console.log();

// 10. Hierarchy validation
console.log('10. Hierarchy validation examples:');
const validationCodes = [
  'RW-KG-GAS-BUM-BUM-BUM', // Valid village
  'RW-KG-GAS-BUM-BUM',     // Valid cell
  'RW-KG-GAS-BUM',         // Valid sector
  'RW-KG-GAS',             // Valid district
  'RW-KG'                  // Valid province
];

validationCodes.forEach(code => {
  const unit = getByCode(code);
  const hierarchy = getFullHierarchy(code);
  const level = getCodeLevel(code);
  
  console.log(`   ${unit?.name} (${code}):`);
  console.log(`     Level: ${level}`);
  console.log(`     Hierarchy length: ${hierarchy.length}`);
  console.log(`     Has parent: ${!!unit?.parentCode}`);
  console.log(`     Valid hierarchy: ${hierarchy.length > 0}`);
});
console.log();

// 11. Navigation path finding
console.log('11. Navigation path finding:');
function findPath(fromCode: string, toCode: string) {
  const fromUnit = getByCode(fromCode);
  const toUnit = getByCode(toCode);
  
  if (!fromUnit || !toUnit) return null;
  
  const fromHierarchy = getFullHierarchy(fromCode);
  const toHierarchy = getFullHierarchy(toCode);
  
  // Find common ancestor
  let commonAncestorIndex = -1;
  for (let i = 0; i < Math.min(fromHierarchy.length, toHierarchy.length); i++) {
    if (fromHierarchy[i].code === toHierarchy[i].code) {
      commonAncestorIndex = i;
    } else {
      break;
    }
  }
  
  if (commonAncestorIndex === -1) return null;
  
  // Build path: up to common ancestor, then down to target
  const upPath = fromHierarchy.slice(commonAncestorIndex + 1).reverse();
  const downPath = toHierarchy.slice(commonAncestorIndex + 1);
  
  return {
    from: fromUnit,
    to: toUnit,
    upPath,
    downPath,
    commonAncestor: fromHierarchy[commonAncestorIndex]
  };
}

const path = findPath('RW-KG-GAS-BUM-BUM-BUM', 'RW-KG-GAS-KIM-BUM-BUM');
if (path) {
  console.log(`   Path from ${path.from.name} to ${path.to.name}:`);
  console.log(`     Common ancestor: ${path.commonAncestor.name}`);
  console.log(`     Steps up: ${path.upPath.length}`);
  console.log(`     Steps down: ${path.downPath.length}`);
  console.log(`     Total steps: ${path.upPath.length + path.downPath.length}`);
}
console.log();

console.log('=== End of Hierarchical Navigation Examples ==='); 