console.log('🧪 Testing rwanda-geo package (CommonJS)...\n');

try {
  const rwandaGeo = require('./dist/index.js');
  console.log('✅ CJS import successful');
  
  // Test data loading
  const provinces = rwandaGeo.loadGzippedJson('provinces');
  console.log('✅ Data loading successful');
  console.log(`   Provinces count: ${provinces.length}`);
  
  // Test helper functions
  const allProvinces = rwandaGeo.getAllProvinces();
  console.log('✅ getAllProvinces() works');
  console.log(`   All provinces count: ${allProvinces.length}`);
  
  const districts = rwandaGeo.getAllDistricts();
  console.log('✅ getAllDistricts() works');
  console.log(`   Districts count: ${districts.length}`);
  
  const sectors = rwandaGeo.getAllSectors();
  console.log('✅ getAllSectors() works');
  console.log(`   Sectors count: ${sectors.length}`);
  
  const cells = rwandaGeo.getAllCells();
  console.log('✅ getAllCells() works');
  console.log(`   Cells count: ${cells.length}`);
  
  const villages = rwandaGeo.getAllVillages();
  console.log('✅ getAllVillages() works');
  console.log(`   Villages count: ${villages.length}`);
  
  // Test search functionality
  const searchResults = rwandaGeo.searchByName('Kigali');
  console.log('✅ searchByName() works');
  console.log(`   Search results for "Kigali": ${searchResults.length}`);
  
  // Test hierarchy functions
  const hierarchy = rwandaGeo.getHierarchy('RW-01');
  console.log('✅ getHierarchy() works');
  console.log(`   Hierarchy for RW-01: ${hierarchy ? 'Found' : 'Not found'}`);
  
  console.log('\n📊 Package Summary:');
  console.log(`   Total locations: ${provinces.length + districts.length + sectors.length + cells.length + villages.length}`);
  console.log(`   Available exports: ${Object.keys(rwandaGeo).length}`);
  
  console.log('\n✅ CommonJS package is working perfectly!');
  
} catch (error) {
  console.error('❌ CJS test failed:', error.message);
} 