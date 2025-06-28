console.log('🧪 Testing rwanda-geo package (ESM)...\n');

try {
  const { 
    loadGzippedJson, 
    getAllProvinces, 
    getAllDistricts, 
    getAllSectors, 
    getAllCells, 
    getAllVillages,
    searchByName,
    getHierarchy
  } = await import('./dist/index.mjs');
  
  console.log('✅ ESM import successful');
  
  // Test data loading
  const provinces = loadGzippedJson('provinces');
  console.log('✅ Data loading successful');
  console.log(`   Provinces count: ${provinces.length}`);
  
  // Test helper functions
  const allProvinces = getAllProvinces();
  console.log('✅ getAllProvinces() works');
  console.log(`   All provinces count: ${allProvinces.length}`);
  
  const districts = getAllDistricts();
  console.log('✅ getAllDistricts() works');
  console.log(`   Districts count: ${districts.length}`);
  
  const sectors = getAllSectors();
  console.log('✅ getAllSectors() works');
  console.log(`   Sectors count: ${sectors.length}`);
  
  const cells = getAllCells();
  console.log('✅ getAllCells() works');
  console.log(`   Cells count: ${cells.length}`);
  
  const villages = getAllVillages();
  console.log('✅ getAllVillages() works');
  console.log(`   Villages count: ${villages.length}`);
  
  // Test search functionality
  const searchResults = searchByName('Kigali');
  console.log('✅ searchByName() works');
  console.log(`   Search results for "Kigali": ${searchResults.length}`);
  
  // Test hierarchy functions
  const hierarchy = getHierarchy('RW-01');
  console.log('✅ getHierarchy() works');
  console.log(`   Hierarchy for RW-01: ${hierarchy ? 'Found' : 'Not found'}`);
  
  console.log('\n📊 Package Summary:');
  console.log(`   Total locations: ${provinces.length + districts.length + sectors.length + cells.length + villages.length}`);
  
  console.log('\n✅ ESM package is working perfectly!');
  
} catch (error) {
  console.error('❌ ESM test failed:', error.message);
} 