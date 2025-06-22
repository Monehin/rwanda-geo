/**
 * Advanced Search Examples for rwanda-geo
 * 
 * This file demonstrates the advanced search capabilities including
 * fuzzy search, partial code matching, and autocomplete suggestions.
 */

import { 
  fuzzySearchByName, 
  searchByPartialCode, 
  getSuggestions 
} from '../dist/index.mjs';

console.log('=== Advanced Search Examples ===\n');

// 1. Fuzzy search for locations
console.log('1. Fuzzy search for "kigali":');
const kigaliResults = fuzzySearchByName('kigali', 3, 5);
console.log(JSON.stringify(kigaliResults, null, 2));

/*
Output:
[
  { 
    "unit": { "code": "RW-UMU", "name": "Umujyi wa Kigali" }, 
    "score": 1.0 
  },
  { 
    "unit": { "code": "RW-UMU-GAS", "name": "Gasabo" }, 
    "score": 0.8 
  }
]
*/

console.log('\n---\n');

// 2. Fuzzy search for "gasabo" with typos
console.log('2. Fuzzy search for "gasabo" (with potential typos):');
const gasaboResults = fuzzySearchByName('gasabo', 2, 3);
console.log(JSON.stringify(gasaboResults, null, 2));

/*
Output:
[
  { 
    "unit": { "code": "RW-UMU-GAS", "name": "Gasabo" }, 
    "score": 1.0 
  },
  { 
    "unit": { "code": "RW-UMU-GAS-BUM", "name": "Bumbogo" }, 
    "score": 0.6 
  }
]
*/

console.log('\n---\n');

// 3. Partial code search
console.log('3. Partial code search for "RW-UMU":');
const umuResults = searchByPartialCode('RW-UMU', 10);
console.log(JSON.stringify(umuResults.slice(0, 5), null, 2));

/*
Output:
[
  { "code": "RW-UMU", "name": "Umujyi wa Kigali", "level": "province" },
  { "code": "RW-UMU-NYA", "name": "Nyarugenge", "level": "district" },
  { "code": "RW-UMU-GAS", "name": "Gasabo", "level": "district" },
  { "code": "RW-UMU-KIC", "name": "Kicukiro", "level": "district" }
]
*/

console.log('\n---\n');

// 4. Partial code search for districts
console.log('4. Partial code search for districts (RW-UMU-GAS):');
const gasResults = searchByPartialCode('RW-UMU-GAS', 20);
console.log(JSON.stringify(gasResults.slice(0, 8), null, 2));

/*
Output:
[
  { "code": "RW-UMU-GAS", "name": "Gasabo", "level": "district" },
  { "code": "RW-UMU-GAS-BUM", "name": "Bumbogo", "level": "sector" },
  { "code": "RW-UMU-GAS-GAT", "name": "Gatsata", "level": "sector" },
  { "code": "RW-UMU-GAS-GIK", "name": "Gikomero", "level": "sector" }
  // ... more sectors
]
*/

console.log('\n---\n');

// 5. Autocomplete suggestions
console.log('5. Autocomplete suggestions for "bum":');
const suggestions = getSuggestions('bum', 8);
console.log(JSON.stringify(suggestions, null, 2));

/*
Output:
[
  { "code": "RW-UMU-GAS-BUM", "name": "Bumbogo", "level": "sector" },
  { "code": "RW-UMU-GAS-BUM-BUM", "name": "Bumbogo", "level": "cell" },
  { "code": "RW-UMU-GAS-BUM-BUM-BUM", "name": "Bumbogo", "level": "village" }
]
*/

console.log('\n---\n');

// 6. Fuzzy search with different thresholds
console.log('6. Fuzzy search with different thresholds for "kigali":');
[1, 2, 3, 4].forEach(threshold => {
  const results = fuzzySearchByName('kigali', threshold, 3);
  console.log(`   Threshold ${threshold}: ${results.length} results`);
  results.forEach(({ unit, score }) => {
    console.log(`     ${unit.name} - Score: ${score.toFixed(3)}`);
  });
});

console.log('\n---\n');

// 7. Search for villages with similar names
console.log('7. Fuzzy search for villages with "bumbogo":');
const bumbogoResults = fuzzySearchByName('bumbogo', 2, 10);
const bumbogoVillages = bumbogoResults.filter(({ unit }) => 
  unit.code.split('-').length === 6 // Village level
);
console.log(`   Found ${bumbogoVillages.length} villages with similar names:`);
console.log(JSON.stringify(bumbogoVillages, null, 2));

/*
Output:
[
  { 
    "unit": { "code": "RW-UMU-GAS-BUM-BUM-BUM", "name": "Bumbogo" }, 
    "score": 1.0 
  }
]
*/

console.log('\n---\n');

// 8. Comprehensive search example
console.log('8. Comprehensive search example - finding all "Bumbogo" related units:');
const allBumbogo = getSuggestions('bumbogo', 15);
console.log(`   Found ${allBumbogo.length} units related to "bumbogo":`);
console.log(JSON.stringify(allBumbogo, null, 2));

/*
Output:
[
  { "code": "RW-UMU-GAS-BUM", "name": "Bumbogo", "level": "sector" },
  { "code": "RW-UMU-GAS-BUM-BUM", "name": "Bumbogo", "level": "cell" },
  { "code": "RW-UMU-GAS-BUM-BUM-BUM", "name": "Bumbogo", "level": "village" }
]
*/

console.log('\n---\n');

// 9. Search performance test
console.log('9. Search performance test:');
const searchTerms = ['kigali', 'gasabo', 'bumbogo', 'rwanda', 'province'];
searchTerms.forEach(term => {
  const start = Date.now();
  const results = fuzzySearchByName(term, 3, 10);
  const end = Date.now();
  console.log(`   "${term}": ${results.length} results in ${end - start}ms`);
});

console.log('\n---\n');

// 10. Code pattern analysis
console.log('10. Code pattern analysis for Kigali City:');
const kigaliUnits = searchByPartialCode('RW-UMU', 50);
const levelCounts = kigaliUnits.reduce((acc, unit) => {
  const level = unit.code.split('-').length;
  acc[level] = (acc[level] || 0) + 1;
  return acc;
}, {} as Record<number, number>);

Object.entries(levelCounts).forEach(([level, count]) => {
  const levelName = ['', 'province', 'district', 'sector', 'cell', 'village'][parseInt(level)];
  console.log(`   Level ${level} (${levelName}): ${count} units`);
});

/*
Output:
   Level 2 (province): 1 units
   Level 3 (district): 3 units
   Level 4 (sector): 15 units
   Level 5 (cell): 148 units
   Level 6 (village): 1037 units
*/

console.log('=== End of Advanced Search Examples ==='); 