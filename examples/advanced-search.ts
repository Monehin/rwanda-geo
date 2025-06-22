/**
 * Advanced Search Examples for rwanda-geo
 * 
 * This file demonstrates the advanced search capabilities including
 * fuzzy search, partial code matching, and autocomplete suggestions.
 */

import {
  fuzzySearchByName,
  searchByPartialCode,
  getSuggestions,
  searchByName,
  searchBySlug
} from '../dist/index.js';

console.log('=== Rwanda Geo Advanced Search Examples ===\n');

// 1. Fuzzy search by name
console.log('1. Fuzzy search for "kigali":');
const kigaliResults = fuzzySearchByName('kigali', 3, 5);
kigaliResults.forEach(({ unit, score }) => {
  console.log(`   ${unit.name} (${unit.code}) - Score: ${score.toFixed(3)}`);
});
console.log();

// 2. Fuzzy search for "gasabo" with typos
console.log('2. Fuzzy search for "gasabo" (with potential typos):');
const gasaboResults = fuzzySearchByName('gasabo', 2, 3);
gasaboResults.forEach(({ unit, score }) => {
  console.log(`   ${unit.name} (${unit.code}) - Score: ${score.toFixed(3)}`);
});
console.log();

// 3. Partial code search
console.log('3. Partial code search for "RW-KG":');
const kgResults = searchByPartialCode('RW-KG', 10);
console.log(`   Found ${kgResults.length} units starting with RW-KG:`);
kgResults.slice(0, 5).forEach(unit => {
  console.log(`   ${unit.code}: ${unit.name}`);
});
if (kgResults.length > 5) {
  console.log(`   ... and ${kgResults.length - 5} more units`);
}
console.log();

// 4. Partial code search for districts
console.log('4. Partial code search for districts (RW-KG-GAS):');
const gasResults = searchByPartialCode('RW-KG-GAS', 20);
console.log(`   Found ${gasResults.length} units starting with RW-KG-GAS:`);
gasResults.slice(0, 8).forEach(unit => {
  console.log(`   ${unit.code}: ${unit.name}`);
});
if (gasResults.length > 8) {
  console.log(`   ... and ${gasResults.length - 8} more units`);
}
console.log();

// 5. Autocomplete suggestions
console.log('5. Autocomplete suggestions for "bum":');
const suggestions = getSuggestions('bum', 8);
suggestions.forEach(({ unit, type, matchField }) => {
  console.log(`   ${unit.name} (${unit.code}) - Type: ${type}, Field: ${matchField}`);
});
console.log();

// 6. Exact name search
console.log('6. Exact name search for "Gasabo":');
const exactGasabo = searchByName('Gasabo');
exactGasabo.forEach(unit => {
  console.log(`   ${unit.name} (${unit.code})`);
});
console.log();

// 7. Slug search
console.log('7. Slug search for "gasabo":');
const slugResults = searchBySlug('gasabo');
slugResults.forEach(unit => {
  console.log(`   ${unit.name} (${unit.code}) - Slug: ${unit.slug}`);
});
console.log();

// 8. Fuzzy search with different thresholds
console.log('8. Fuzzy search with different thresholds for "kigali":');
[1, 2, 3, 4].forEach(threshold => {
  const results = fuzzySearchByName('kigali', threshold, 3);
  console.log(`   Threshold ${threshold}: ${results.length} results`);
  results.forEach(({ unit, score }) => {
    console.log(`     ${unit.name} - Score: ${score.toFixed(3)}`);
  });
});
console.log();

// 9. Search for villages with similar names
console.log('9. Fuzzy search for villages with "bumbogo":');
const bumbogoResults = fuzzySearchByName('bumbogo', 2, 10);
const bumbogoVillages = bumbogoResults.filter(({ unit }) => 
  unit.code.split('-').length === 6 // Village level
);
console.log(`   Found ${bumbogoVillages.length} villages with similar names:`);
bumbogoVillages.forEach(({ unit, score }) => {
  console.log(`   ${unit.name} (${unit.code}) - Score: ${score.toFixed(3)}`);
});
console.log();

// 10. Comprehensive search example
console.log('10. Comprehensive search example - finding all "Bumbogo" related units:');
const allBumbogo = getSuggestions('bumbogo', 15);
console.log(`   Found ${allBumbogo.length} units related to "bumbogo":`);

// Group by type
const byType = allBumbogo.reduce((acc, { unit, type }) => {
  if (!acc[type]) acc[type] = [];
  acc[type].push(unit);
  return acc;
}, {} as Record<string, any[]>);

Object.entries(byType).forEach(([type, units]) => {
  console.log(`   ${type.toUpperCase()} matches (${units.length}):`);
  units.forEach(unit => {
    console.log(`     ${unit.name} (${unit.code})`);
  });
});
console.log();

// 11. Search performance test
console.log('11. Search performance test:');
const searchTerms = ['kigali', 'gasabo', 'bumbogo', 'rwanda', 'province'];
searchTerms.forEach(term => {
  const start = Date.now();
  const results = fuzzySearchByName(term, 3, 10);
  const end = Date.now();
  console.log(`   "${term}": ${results.length} results in ${end - start}ms`);
});
console.log();

// 12. Code pattern analysis
console.log('12. Code pattern analysis for Kigali City:');
const kigaliUnits = searchByPartialCode('RW-KG', 50);
const levelCounts = kigaliUnits.reduce((acc, unit) => {
  const level = unit.code.split('-').length;
  acc[level] = (acc[level] || 0) + 1;
  return acc;
}, {} as Record<number, number>);

Object.entries(levelCounts).forEach(([level, count]) => {
  const levelName = ['', 'province', 'district', 'sector', 'cell', 'village'][parseInt(level)];
  console.log(`   Level ${level} (${levelName}): ${count} units`);
});
console.log();

console.log('=== End of Advanced Search Examples ==='); 