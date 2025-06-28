const { 
  getAllProvinces, 
  getAllDistricts, 
  getAllSectors, 
  getAllCells, 
  getAllVillages,
  searchByName,
  searchBySlug,
  fuzzySearchByName,
  getSuggestions
} = require('./dist/index.js');

console.log('=== Testing Resilient Search Functions ===\n');

console.log('=== Testing Individual Functions ===');

// Test individual getters
console.log('Provinces:', getAllProvinces().length);
console.log('Districts:', getAllDistricts().length);
console.log('Sectors:', getAllSectors().length);
console.log('Cells:', getAllCells().length);
console.log('Villages:', getAllVillages().length);

console.log('\n=== Testing Search Functions ===');

// Test search functions
console.log('Search by name "Kigali":', searchByName('Kigali').length);
console.log('Search by slug "kigali":', searchBySlug('kigali').length);
console.log('Fuzzy search "Gasabo":', fuzzySearchByName('Gasabo', 3, 5).length);
console.log('Suggestions for "gas":', getSuggestions('gas', 5).length);

console.log('\n✅ All search functions completed successfully!'); 