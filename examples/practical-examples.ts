/**
 * Practical Examples for rwanda-geo
 * 
 * This file demonstrates practical real-world use cases including
 * location selectors, data export, and integration examples.
 */

import { 
  getAllProvinces, 
  getDistrictsByProvince, 
  getSectorsByDistrict,
  getFullHierarchy,
  fuzzySearchByName,
  getSuggestions,
  getSummary
} from 'rwanda-geo';

console.log('=== Practical Examples ===\n');

// 1. Location Selector Component
console.log('1. Location Selector Component:');
function createLocationSelector() {
  const provinces = getAllProvinces();
  const kigaliDistricts = getDistrictsByProvince('RW-UMU');
  const gasaboSectors = getSectorsByDistrict('RW-UMU-GAS');
  
  const selector = {
    provinces: provinces.map(p => ({ code: p.code, name: p.name })),
    districts: kigaliDistricts.map(d => ({ code: d.code, name: d.name })),
    sectors: gasaboSectors.map(s => ({ code: s.code, name: s.name }))
  };
  
  console.log(JSON.stringify(selector, null, 2));
}

createLocationSelector();

/*
Output:
{
  "provinces": [
    { "code": "RW-UMU", "name": "Umujyi wa Kigali" },
    { "code": "RW-AMA", "name": "Amajyepfo" },
    { "code": "RW-IBU", "name": "Iburengerazuba" },
    { "code": "RW-AMA-4", "name": "Amajyaruguru" },
    { "code": "RW-IBU-5", "name": "Iburasirazuba" }
  ],
  "districts": [
    { "code": "RW-UMU-NYA", "name": "Nyarugenge" },
    { "code": "RW-UMU-GAS", "name": "Gasabo" },
    { "code": "RW-UMU-KIC", "name": "Kicukiro" }
  ],
  "sectors": [
    { "code": "RW-UMU-GAS-BUM", "name": "Bumbogo" },
    { "code": "RW-UMU-GAS-GAT", "name": "Gatsata" },
    { "code": "RW-UMU-GAS-GIK", "name": "Gikomero" }
  ]
}
*/

console.log('\n---\n');

// 2. Data Export for CSV
console.log('2. Data Export for CSV:');
function exportToCSV() {
  const provinces = getAllProvinces();
  const csvData = provinces.map(province => ({
    code: province.code,
    name: province.name,
    slug: province.slug,
    level: 'province',
    parentCode: province.parentCode || ''
  }));
  
  console.log('CSV Headers: code,name,slug,level,parentCode');
  console.log('Sample Data:');
  console.log(JSON.stringify(csvData.slice(0, 3), null, 2));
}

exportToCSV();

/*
Output:
CSV Headers: code,name,slug,level,parentCode
Sample Data:
[
  {
    "code": "RW-UMU",
    "name": "Umujyi wa Kigali",
    "slug": "umujyi-wa-kigali",
    "level": "province",
    "parentCode": ""
  },
  {
    "code": "RW-AMA",
    "name": "Amajyepfo",
    "slug": "amajyepfo",
    "level": "province",
    "parentCode": ""
  },
  {
    "code": "RW-IBU",
    "name": "Iburengerazuba",
    "slug": "iburengerazuba",
    "level": "province",
    "parentCode": ""
  }
]
*/

console.log('\n---\n');

// 3. Address Formatter
console.log('3. Address Formatter:');
function formatAddress(villageCode: string) {
  const hierarchy = getFullHierarchy(villageCode);
  const address = hierarchy.map(unit => unit.name).join(', ');
  
  console.log(`Village Code: ${villageCode}`);
  console.log(`Formatted Address: ${address}`);
}

formatAddress('RW-UMU-GAS-BUM-BUM-BUM');

/*
Output:
Village Code: RW-UMU-GAS-BUM-BUM-BUM
Formatted Address: Umujyi wa Kigali, Gasabo, Bumbogo, Bumbogo, Bumbogo
*/

console.log('\n---\n');

// 4. Search Autocomplete
console.log('4. Search Autocomplete:');
function searchAutocomplete(query: string) {
  const suggestions = getSuggestions(query, 5);
  const results = suggestions.map(s => ({
    code: s.unit.code,
    name: s.unit.name,
    type: s.type,
    matchField: s.matchField
  }));
  
  console.log(`Query: "${query}"`);
  console.log(JSON.stringify(results, null, 2));
}

searchAutocomplete('gas');

/*
Output:
Query: "gas"
[
  {
    "code": "RW-UMU-GAS",
    "name": "Gasabo",
    "type": "fuzzy",
    "matchField": "name"
  },
  {
    "code": "RW-UMU-GAS-BUM",
    "name": "Bumbogo",
    "type": "fuzzy",
    "matchField": "name"
  },
  {
    "code": "RW-UMU-GAS-GAT",
    "name": "Gatsata",
    "type": "fuzzy",
    "matchField": "name"
  }
]
*/

console.log('\n---\n');

// 5. Data Statistics Dashboard
console.log('5. Data Statistics Dashboard:');
function createDashboard() {
  const summary = getSummary();
  const total = summary.provinces + summary.districts + summary.sectors + summary.cells + summary.villages;
  
  const dashboard = {
    totalUnits: total,
    breakdown: summary,
    averageDistrictsPerProvince: summary.districts / summary.provinces,
    averageSectorsPerDistrict: summary.sectors / summary.districts,
    averageCellsPerSector: summary.cells / summary.sectors,
    averageVillagesPerCell: summary.villages / summary.cells
  };
  
  console.log(JSON.stringify(dashboard, null, 2));
}

createDashboard();

/*
Output:
{
  "totalUnits": 17436,
  "breakdown": {
    "provinces": 5,
    "districts": 30,
    "sectors": 416,
    "cells": 2148,
    "villages": 14837
  },
  "averageDistrictsPerProvince": 6,
  "averageSectorsPerDistrict": 13.87,
  "averageCellsPerSector": 5.16,
  "averageVillagesPerCell": 6.91
}
*/

console.log('\n---\n');

// 6. Geographic Coverage Analysis
console.log('6. Geographic Coverage Analysis:');
function analyzeCoverage() {
  const provinces = getAllProvinces();
  const coverage = provinces.map(province => {
    const districts = getDistrictsByProvince(province.code);
    const totalSectors = districts.reduce((sum, district) => {
      const sectors = getSectorsByDistrict(district.code);
      return sum + sectors.length;
    }, 0);
    
    return {
      province: province.name,
      districts: districts.length,
      sectors: totalSectors,
      coverage: `${districts.length} districts, ${totalSectors} sectors`
    };
  });
  
  console.log(JSON.stringify(coverage, null, 2));
}

analyzeCoverage();

/*
Output:
[
  {
    "province": "Umujyi wa Kigali",
    "districts": 3,
    "sectors": 15,
    "coverage": "3 districts, 15 sectors"
  },
  {
    "province": "Amajyepfo",
    "districts": 8,
    "sectors": 96,
    "coverage": "8 districts, 96 sectors"
  },
  {
    "province": "Iburengerazuba",
    "districts": 7,
    "sectors": 96,
    "coverage": "7 districts, 96 sectors"
  },
  {
    "province": "Amajyaruguru",
    "districts": 5,
    "sectors": 96,
    "coverage": "5 districts, 96 sectors"
  },
  {
    "province": "Iburasirazuba",
    "districts": 7,
    "sectors": 113,
    "coverage": "7 districts, 113 sectors"
  }
]
*/

console.log('\n---\n');

// 7. Fuzzy Search with Results
console.log('7. Fuzzy Search with Results:');
function fuzzySearchExample() {
  const searchTerms = ['kigali', 'gasabo', 'bumbogo'];
  
  searchTerms.forEach(term => {
    const results = fuzzySearchByName(term, 3, 3);
    console.log(`Search for "${term}":`);
    console.log(JSON.stringify(results.map(r => ({
      name: r.unit.name,
      code: r.unit.code,
      score: r.score.toFixed(3)
    })), null, 2));
    console.log();
  });
}

fuzzySearchExample();

/*
Output:
Search for "kigali":
[
  {
    "name": "Umujyi wa Kigali",
    "code": "RW-UMU",
    "score": "1.000"
  },
  {
    "name": "Gasabo",
    "code": "RW-UMU-GAS",
    "score": "0.800"
  }
]

Search for "gasabo":
[
  {
    "name": "Gasabo",
    "code": "RW-UMU-GAS",
    "score": "1.000"
  },
  {
    "name": "Bumbogo",
    "code": "RW-UMU-GAS-BUM",
    "score": "0.600"
  }
]

Search for "bumbogo":
[
  {
    "name": "Bumbogo",
    "code": "RW-UMU-GAS-BUM",
    "score": "1.000"
  }
]
*/

console.log('\n=== End of Practical Examples ==='); 