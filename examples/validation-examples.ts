/**
 * Validation Examples for rwanda-geo
 * 
 * This file demonstrates the validation capabilities including
 * code format validation, parent-child relationship validation,
 * hierarchy integrity checks, and unit property validation.
 */

import {
  validateCodeFormat,
  validateParentChildRelationship,
  validateHierarchyIntegrity,
  validateUnitProperties,
  isValidCode,
  getCodeLevel,
  getByCode
} from '../dist/index.js';

console.log('=== Rwanda Geo Validation Examples ===\n');

// 1. Code format validation
console.log('1. Code format validation:');
const testCodes = [
  'RW-KG',                    // Valid province
  'RW-KG-GAS',                // Valid district
  'RW-KG-GAS-BUM',            // Valid sector
  'RW-KG-GAS-BUM-BUM',        // Valid cell
  'RW-KG-GAS-BUM-BUM-BUM',    // Valid village
  'RW-KG-GAS-BUM-BUM-BUM-1',  // Valid village with uniqueness suffix
  'INVALID-CODE',             // Invalid format
  'RW-KG-GAS-BUM-BUM-BUM-BUM', // Too many segments
  'RW-KG-GAS-BUM-BUM-BUM-BUM-BUM', // Too many segments
  'RW-KG-GAS-BUM-BUM-BUM-BUM-BUM-BUM' // Too many segments
];

testCodes.forEach(code => {
  const validation = validateCodeFormat(code);
  console.log(`   ${code}:`);
  console.log(`     Valid: ${validation.isValid}`);
  if (validation.level) {
    console.log(`     Level: ${validation.level}`);
  }
  if (validation.format) {
    console.log(`     Format: ${validation.format}`);
  }
  if (validation.error) {
    console.log(`     Error: ${validation.error}`);
  }
});
console.log();

// 2. Parent-child relationship validation
console.log('2. Parent-child relationship validation:');
const relationshipTests = [
  { parent: 'RW-KG', child: 'RW-KG-GAS' },           // Valid: province -> district
  { parent: 'RW-KG-GAS', child: 'RW-KG-GAS-BUM' },   // Valid: district -> sector
  { parent: 'RW-KG-GAS-BUM', child: 'RW-KG-GAS-BUM-BUM' }, // Valid: sector -> cell
  { parent: 'RW-KG-GAS-BUM-BUM', child: 'RW-KG-GAS-BUM-BUM-BUM' }, // Valid: cell -> village
  { parent: 'RW-KG-GAS', child: 'RW-KG-GAS-BUM-BUM' }, // Invalid: district -> cell (skips sector)
  { parent: 'RW-KG-GAS-BUM', child: 'RW-KG-GAS' },   // Invalid: sector -> district (wrong direction)
  { parent: 'RW-KG-GAS', child: 'RW-SO-GIS' },       // Invalid: different provinces
  { parent: 'INVALID', child: 'RW-KG-GAS' },         // Invalid: parent doesn't exist
  { parent: 'RW-KG-GAS', child: 'INVALID' }          // Invalid: child doesn't exist
];

relationshipTests.forEach(({ parent, child }) => {
  const validation = validateParentChildRelationship(parent, child);
  console.log(`   ${parent} -> ${child}:`);
  console.log(`     Valid: ${validation.isValid}`);
  if (validation.parentLevel) {
    console.log(`     Parent level: ${validation.parentLevel}`);
  }
  if (validation.childLevel) {
    console.log(`     Child level: ${validation.childLevel}`);
  }
  if (validation.error) {
    console.log(`     Error: ${validation.error}`);
  }
});
console.log();

// 3. Hierarchy integrity validation
console.log('3. Hierarchy integrity validation:');
const integrity = validateHierarchyIntegrity();
console.log(`   Overall integrity: ${integrity.isValid}`);
console.log(`   Summary:`);
console.log(`     Total units: ${integrity.summary.totalUnits}`);
console.log(`     Orphaned units: ${integrity.summary.orphanedUnits}`);
console.log(`     Invalid parents: ${integrity.summary.invalidParents}`);
console.log(`     Circular references: ${integrity.summary.circularReferences}`);
console.log(`     Missing units: ${integrity.summary.missingUnits}`);

if (integrity.issues.length > 0) {
  console.log(`   Issues found:`);
  integrity.issues.slice(0, 5).forEach(issue => {
    console.log(`     ${issue.type}: ${issue.message}`);
    if (issue.code) {
      console.log(`       Code: ${issue.code}`);
    }
  });
  if (integrity.issues.length > 5) {
    console.log(`     ... and ${integrity.issues.length - 5} more issues`);
  }
}
console.log();

// 4. Unit property validation
console.log('4. Unit property validation:');
const testUnits = [
  getByCode('RW-KG'),                    // Valid province
  getByCode('RW-KG-GAS'),                // Valid district
  getByCode('RW-KG-GAS-BUM'),            // Valid sector
  getByCode('RW-KG-GAS-BUM-BUM'),        // Valid cell
  getByCode('RW-KG-GAS-BUM-BUM-BUM'),    // Valid village
  { code: 'TEST', name: '', slug: 'test' } as any, // Invalid: missing required properties
  { code: 'TEST', name: 'Test', slug: '' } as any, // Invalid: empty slug
  { code: '', name: 'Test', slug: 'test' } as any  // Invalid: empty code
];

testUnits.forEach((unit, index) => {
  if (unit) {
    const validation = validateUnitProperties(unit);
    console.log(`   Unit ${index + 1} (${unit.code}):`);
    console.log(`     Valid: ${validation.isValid}`);
    if (validation.issues.length > 0) {
      console.log(`     Issues:`);
      validation.issues.forEach(issue => {
        console.log(`       - ${issue}`);
      });
    }
  }
});
console.log();

// 5. Code level determination
console.log('5. Code level determination:');
const levelTestCodes = [
  'RW-KG',                    // Province
  'RW-KG-GAS',                // District
  'RW-KG-GAS-BUM',            // Sector
  'RW-KG-GAS-BUM-BUM',        // Cell
  'RW-KG-GAS-BUM-BUM-BUM',    // Village
  'RW-KG-GAS-BUM-BUM-BUM-1',  // Village with uniqueness suffix
  'INVALID-CODE',             // Invalid
  'RW-KG-GAS-BUM-BUM-BUM-BUM-BUM-BUM' // Too many segments
];

levelTestCodes.forEach(code => {
  const level = getCodeLevel(code);
  const isValid = isValidCode(code);
  console.log(`   ${code}:`);
  console.log(`     Valid: ${isValid}`);
  console.log(`     Level: ${level || 'undefined'}`);
});
console.log();

// 6. Comprehensive validation example
console.log('6. Comprehensive validation example:');
function comprehensiveValidation(code: string) {
  console.log(`   Validating: ${code}`);
  
  // Check if code exists
  const unit = getByCode(code);
  if (!unit) {
    console.log(`     ❌ Unit not found`);
    return;
  }
  
  // Validate code format
  const formatValidation = validateCodeFormat(code);
  console.log(`     Code format: ${formatValidation.isValid ? '✅' : '❌'}`);
  
  // Validate unit properties
  const propertyValidation = validateUnitProperties(unit);
  console.log(`     Properties: ${propertyValidation.isValid ? '✅' : '❌'}`);
  
  // Check parent-child relationship if applicable
  if (unit.parentCode) {
    const relationshipValidation = validateParentChildRelationship(unit.parentCode, code);
    console.log(`     Parent relationship: ${relationshipValidation.isValid ? '✅' : '❌'}`);
  } else {
    console.log(`     Parent relationship: ✅ (root level)`);
  }
  
  // Check if unit has children
  const children = unit.parentCode ? [] : []; // Simplified for example
  console.log(`     Has children: ${children.length > 0 ? '✅' : '❌'}`);
  
  return {
    unit,
    formatValid: formatValidation.isValid,
    propertiesValid: propertyValidation.isValid,
    relationshipValid: unit.parentCode ? validateParentChildRelationship(unit.parentCode, code).isValid : true
  };
}

const comprehensiveTestCodes = [
  'RW-KG',
  'RW-KG-GAS',
  'RW-KG-GAS-BUM',
  'RW-KG-GAS-BUM-BUM',
  'RW-KG-GAS-BUM-BUM-BUM'
];

comprehensiveTestCodes.forEach(code => {
  comprehensiveValidation(code);
  console.log();
});
console.log();

// 7. Validation performance test
console.log('7. Validation performance test:');
const performanceTestCodes = [
  'RW-KG',
  'RW-KG-GAS',
  'RW-KG-GAS-BUM',
  'RW-KG-GAS-BUM-BUM',
  'RW-KG-GAS-BUM-BUM-BUM'
];

performanceTestCodes.forEach(code => {
  const start = Date.now();
  
  // Run multiple validations
  for (let i = 0; i < 100; i++) {
    validateCodeFormat(code);
    isValidCode(code);
    getCodeLevel(code);
  }
  
  const end = Date.now();
  console.log(`   ${code}: ${end - start}ms for 100 validations`);
});
console.log();

console.log('=== End of Validation Examples ==='); 