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
  getSummary,
  getAllProvinces
} from 'rwanda-geo';

console.log('=== Validation Examples ===\n');

// 1. Validate code format
console.log('1. Code format validation:');
const validation = validateCodeFormat('RW-UMU-GAS-BUM-BUM-BUM');
console.log(JSON.stringify(validation, null, 2));

/*
Output:
{
  "isValid": true,
  "level": "village",
  "format": "RW-XX-YY-ZZ-AA-BB"
}
*/

console.log('\n---\n');

// 2. Validate parent-child relationship
console.log('2. Parent-child relationship validation:');
const relationship = validateParentChildRelationship('RW-UMU-GAS', 'RW-UMU-GAS-BUM');
console.log(JSON.stringify(relationship, null, 2));

/*
Output:
{
  "isValid": true,
  "parentLevel": "district",
  "childLevel": "sector"
}
*/

console.log('\n---\n');

// 3. Check overall hierarchy integrity
console.log('3. Hierarchy integrity validation:');
const integrity = validateHierarchyIntegrity();
console.log(JSON.stringify(integrity, null, 2));

/*
Output:
{
  "isValid": true,
  "summary": {
    "totalUnits": 17436,
    "orphanedUnits": 0,
    "invalidParents": 0,
    "circularReferences": 0,
    "missingUnits": 0
  }
}
*/

console.log('\n---\n');

// 4. Get data summary
console.log('4. Data summary:');
const summary = getSummary();
console.log(JSON.stringify(summary, null, 2));

/*
Output:
{
  "provinces": 5,
  "districts": 30,
  "sectors": 416,
  "cells": 2148,
  "villages": 14837
}
*/

console.log('\n---\n');

// 5. Validate unit properties for a sample unit
console.log('5. Unit properties validation (sample unit):');
const sampleUnit = getAllProvinces()[0];
const unitValidation = validateUnitProperties(sampleUnit);
console.log(JSON.stringify(unitValidation, null, 2));

/*
Output:
{
  "isValid": true,
  "issues": []
}
*/

console.log('\n---\n');

// 6. Test invalid code formats
console.log('6. Invalid code format tests:');
const invalidCodes = [
  'INVALID-CODE',
  'RW-UMU-GAS-BUM-BUM-BUM-BUM', // Too many segments
  'RW-UMU', // Too few segments for village
  'XX-UMU-GAS-BUM-BUM-BUM' // Wrong country code
];

invalidCodes.forEach(code => {
  const result = validateCodeFormat(code);
  console.log(`${code}: ${result.isValid ? 'Valid' : 'Invalid'} - ${result.level || 'Unknown level'}`);
});

/*
Output:
INVALID-CODE: Invalid - Unknown level
RW-UMU-GAS-BUM-BUM-BUM-BUM: Invalid - Unknown level
RW-UMU: Invalid - province
XX-UMU-GAS-BUM-BUM-BUM: Invalid - Unknown level
*/

console.log('\n---\n');

// 7. Test invalid parent-child relationships
console.log('7. Invalid parent-child relationship tests:');
const invalidRelationships = [
  { parent: 'RW-UMU-GAS', child: 'RW-UMU-NYA-BUM' }, // Different parents
  { parent: 'RW-UMU-GAS-BUM', child: 'RW-UMU-GAS' }, // Wrong direction
  { parent: 'RW-UMU-GAS-BUM-BUM', child: 'RW-UMU-GAS-BUM-BUM-BUM-BUM' } // Too many levels
];

invalidRelationships.forEach(({ parent, child }) => {
  const result = validateParentChildRelationship(parent, child);
  console.log(`${parent} -> ${child}: ${result.isValid ? 'Valid' : 'Invalid'}`);
});

/*
Output:
RW-UMU-GAS -> RW-UMU-NYA-BUM: Invalid
RW-UMU-GAS-BUM -> RW-UMU-GAS: Invalid
RW-UMU-GAS-BUM-BUM -> RW-UMU-GAS-BUM-BUM-BUM-BUM: Invalid
*/

console.log('\n---\n');

// 8. Comprehensive validation report
console.log('8. Comprehensive validation report:');
const codeValidation = validateCodeFormat('RW-UMU-GAS-BUM-BUM-BUM');
const relationshipValidation = validateParentChildRelationship('RW-UMU-GAS', 'RW-UMU-GAS-BUM');
const hierarchyValidation = validateHierarchyIntegrity();
const unitValidation2 = validateUnitProperties(sampleUnit);

const comprehensiveReport = {
  codeFormat: codeValidation,
  parentChildRelationship: relationshipValidation,
  hierarchyIntegrity: hierarchyValidation,
  unitProperties: unitValidation2,
  summary: summary,
  overallValid: codeValidation.isValid && 
                relationshipValidation.isValid && 
                hierarchyValidation.isValid && 
                unitValidation2.isValid
};

console.log(JSON.stringify(comprehensiveReport, null, 2));

/*
Output:
{
  "codeFormat": {
    "isValid": true,
    "level": "village",
    "format": "RW-XX-YY-ZZ-AA-BB"
  },
  "parentChildRelationship": {
    "isValid": true,
    "parentLevel": "district",
    "childLevel": "sector"
  },
  "hierarchyIntegrity": {
    "isValid": true,
    "summary": {
      "totalUnits": 17436,
      "orphanedUnits": 0,
      "invalidParents": 0,
      "circularReferences": 0,
      "missingUnits": 0
    }
  },
  "unitProperties": {
    "isValid": true,
    "issues": []
  },
  "summary": {
    "provinces": 5,
    "districts": 30,
    "sectors": 416,
    "cells": 2148,
    "villages": 14837
  },
  "overallValid": true
}
*/

console.log('\n=== End of Validation Examples ==='); 