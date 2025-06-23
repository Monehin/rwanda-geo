/**
 * Practical Examples for rwanda-geo
 * 
 * This file demonstrates practical use cases and real-world applications
 * of the rwanda-geo package.
 */

import {
  getAllProvinces,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getByCode,
  searchByName,
  fuzzySearchByName,
  getHierarchy
} from '../dist/index.mjs';

console.log('=== Practical Examples ===\n');

// 1. Location Selector Component
console.log('1. Location Selector Component:');

// Get provinces for dropdown
const provinces = getAllProvinces();
console.log('Provinces dropdown:');
provinces.forEach(province => {
  console.log(`  <option value="${province.code}">${province.name}</option>`);
});

// Get districts for selected province
const kigaliDistricts = getDistrictsByProvince('RW-01');
const gasaboSectors = getSectorsByDistrict('RW-D-01');

console.log('\nDistricts in Kigali City:');
kigaliDistricts.forEach(district => {
  console.log(`  <option value="${district.code}">${district.name}</option>`);
});

console.log('\nSectors in Gasabo:');
gasaboSectors.slice(0, 5).forEach(sector => {
  console.log(`  <option value="${sector.code}">${sector.name}</option>`);
});

console.log('\n---\n');

// 2. Data Analysis and Reporting
console.log('2. Data Analysis and Reporting:');

// Province statistics
console.log('Province Statistics:');
provinces.forEach(province => {
  const districts = getDistrictsByProvince(province.code);
  const totalSectors = districts.reduce((sum, district) => {
    return sum + getSectorsByDistrict(district.code).length;
  }, 0);
  
  console.log(`${province.name}:`);
  console.log(`  Districts: ${districts.length}`);
  console.log(`  Sectors: ${totalSectors}`);
  console.log();
});

console.log('\n---\n');

// 3. Search Autocomplete Component
console.log('3. Search Autocomplete Component:');

// Function to format address
function formatAddress(villageCode: string): string {
  const village = getByCode(villageCode);
  if (!village) return 'Location not found';
  
  const hierarchy: string[] = [];
  let current: any = village;
  
  while (current) {
    hierarchy.unshift(current.name);
    current = current.parentCode ? getByCode(current.parentCode) : null;
  }
  
  return hierarchy.join(', ');
}

// Example usage
const address = formatAddress('RW-V-00001');
console.log('Formatted Address:');
console.log(`Village Code: RW-V-00001`);
console.log(`Address: ${address}`);

console.log('\n---\n');

// 4. Geographic Visualization Helper
console.log('4. Geographic Visualization Helper:');

// Get data for map visualization
const mapData = {
  provinces: provinces.map(province => ({
    code: province.code,
    name: province.name,
    center: province.center
  })),
  districts: kigaliDistricts.map(district => ({
    code: district.code,
    name: district.name,
    center: district.center
  })),
  sectors: gasaboSectors.map(sector => ({
    code: sector.code,
    name: sector.name,
    center: sector.center
  }))
};

console.log('Map Data Structure:');
console.log(JSON.stringify(mapData, null, 2));

console.log('\n---\n');

// 5. Data Export and Integration
console.log('5. Data Export and Integration:');

// Export to CSV format
function exportToCSV(units: any[]): string {
  const headers = ['code', 'name', 'slug', 'parentCode', 'center'];
  const csvContent = [
    headers.join(','),
    ...units.map(unit => 
      headers.map(header => {
        const value = unit[header];
        if (header === 'center' && value) {
          return `"${value.lat},${value.lng}"`;
        }
        return `"${value || ''}"`;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

const csvData = exportToCSV(provinces);
console.log('CSV Export (first few lines):');
console.log(csvData.split('\n').slice(0, 5).join('\n'));

console.log('\n---\n');

// 6. Performance Monitoring
console.log('6. Performance Monitoring:');

// Search performance test
const searchTerms = ['kigali', 'gasabo', 'bumbogo'];
searchTerms.forEach(term => {
  const start = Date.now();
  const results = searchByName(term);
  const end = Date.now();
  
  console.log(`Search "${term}": ${results.length} results in ${end - start}ms`);
});

// Fuzzy search performance
console.log('\nFuzzy search performance:');
searchTerms.forEach(term => {
  const start = Date.now();
  const results = fuzzySearchByName(term, 0.8, 10);
  const end = Date.now();
  
  console.log(`Fuzzy search "${term}": ${results.length} results in ${end - start}ms`);
});

console.log('\n---\n');

// 7. Real-world Application: Address Validation
console.log('7. Address Validation Application:');

function validateAddress(provinceCode: string, districtCode: string, sectorCode: string): {
  isValid: boolean;
  errors: string[];
  suggestions?: any[];
} {
  const errors: string[] = [];
  const suggestions: any[] = [];
  
  // Validate province
  const province = getByCode(provinceCode);
  if (!province) {
    errors.push(`Invalid province code: ${provinceCode}`);
    suggestions.push(...searchByName(provinceCode));
  }
  
  // Validate district
  const district = getByCode(districtCode);
  if (!district) {
    errors.push(`Invalid district code: ${districtCode}`);
    suggestions.push(...searchByName(districtCode));
  } else if (district.parentCode !== provinceCode) {
    errors.push(`District ${districtCode} does not belong to province ${provinceCode}`);
  }
  
  // Validate sector
  const sector = getByCode(sectorCode);
  if (!sector) {
    errors.push(`Invalid sector code: ${sectorCode}`);
    suggestions.push(...searchByName(sectorCode));
  } else if (sector.parentCode !== districtCode) {
    errors.push(`Sector ${sectorCode} does not belong to district ${districtCode}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
}

// Test address validation
const validationResult = validateAddress('RW-01', 'RW-D-01', 'RW-S-001');
console.log('Address Validation Result:');
console.log(JSON.stringify(validationResult, null, 2));

console.log('\n---\n');

// 8. Data Integration Example
console.log('8. Data Integration Example:');

// Simulate external data with location codes
const externalData = [
  { id: 1, name: 'User 1', location: 'RW-D-01' },
  { id: 2, name: 'User 2', location: 'RW-S-001' },
  { id: 3, name: 'User 3', location: 'RW-C-0001' },
  { id: 4, name: 'User 4', location: 'INVALID-CODE' }
];

// Enrich external data with location information
const enrichedData = externalData.map(item => {
  const location = getByCode(item.location);
  return {
    ...item,
    locationInfo: location ? {
      name: location.name,
      level: location.code.startsWith('RW-') ? 
        (location.code.startsWith('RW-D-') ? 'district' :
         location.code.startsWith('RW-S-') ? 'sector' :
         location.code.startsWith('RW-C-') ? 'cell' :
         location.code.startsWith('RW-V-') ? 'village' : 'province') : 'unknown',
      hierarchy: location ? getHierarchy(location.code).map(h => h.name) : []
    } : null
  };
});

console.log('Enriched External Data:');
console.log(JSON.stringify(enrichedData, null, 2));

console.log('\n=== End of Practical Examples ==='); 