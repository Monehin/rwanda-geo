const fs = require('fs');
const path = require('path');
const { 
  loadLocationsData, 
  PATHS, 
  logSection, 
  logSuccess, 
  logError 
} = require('./utils');

async function main() {
  console.log('Starting data extraction from locations.json.gz...');

  // Load locations data using shared utility
  let locations;
  try {
    locations = await loadLocationsData();
  } catch (error) {
    logError(error.message);
    process.exit(1);
  }

  // Helper to generate slug
  function generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Helper to ensure unique slug
  function generateUniqueSlug(name, existingSlugs = new Set()) {
    let slug = generateSlug(name);
    let counter = 1;
    let originalSlug = slug;
    
    while (existingSlugs.has(slug)) {
      slug = `${originalSlug}-${counter}`;
      counter++;
      if (counter > 1000) break; // Prevent infinite loop
    }
    
    return slug;
  }

  // Extract and organize data using composite keys
  const provinces = new Map();
  const districts = new Map();
  const sectors = new Map();
  const cells = new Map();
  const villages = new Map();

  console.log('Processing locations...');

  // Helper to make composite key
  function compositeKey(name, parent) {
    return parent ? `${parent}::${name}` : name;
  }

  locations.provinces.forEach(province => {
    const provinceName = province.name;
    const provinceKey = provinceName;
    provinces.set(provinceKey, {
      name: provinceName,
      districts: new Map()
    });
    
    province.districts.forEach(district => {
      const districtName = district.name;
      const districtKey = compositeKey(districtName, provinceName);
      districts.set(districtKey, {
        name: districtName,
        province: provinceName,
        sectors: new Map()
      });
      provinces.get(provinceKey).districts.set(districtKey, districts.get(districtKey));
      
      district.sectors.forEach(sector => {
        const sectorName = sector.name;
        const sectorKey = compositeKey(sectorName, districtKey);
        sectors.set(sectorKey, {
          name: sectorName,
          district: districtKey,
          cells: new Map()
        });
        districts.get(districtKey).sectors.set(sectorKey, sectors.get(sectorKey));
        
        sector.cells.forEach(cell => {
          const cellName = cell.name;
          const cellKey = compositeKey(cellName, sectorKey);
          cells.set(cellKey, {
            name: cellName,
            sector: sectorKey,
            villages: new Map()
          });
          sectors.get(sectorKey).cells.set(cellKey, cells.get(cellKey));
          
          cell.villages.forEach(village => {
            const villageName = village.name;
            const villageKey = compositeKey(villageName, cellKey);
            villages.set(villageKey, {
              name: villageName,
              cell: cellKey
            });
            cells.get(cellKey).villages.set(villageKey, villages.get(villageKey));
          });
        });
      });
    });
  });

  console.log(`Found: ${provinces.size} provinces, ${districts.size} districts, ${sectors.size} sectors, ${cells.size} cells, ${villages.size} villages`);

  // Generate data with new simplified codes
  const provincesData = [];
  const districtsData = [];
  const sectorsData = [];
  const cellsData = [];
  const villagesData = [];

  // Track used slugs for uniqueness
  const usedSlugs = new Set();

  // Maps to store generated codes for parent references
  const provinceCodeMap = new Map(); // provinceName -> code
  const districtCodeMap = new Map(); // districtKey -> code
  const sectorCodeMap = new Map();   // sectorKey -> code
  const cellCodeMap = new Map();     // cellKey -> code

  // Generate provinces with new format: RW-01, RW-02, etc.
  console.log('Generating provinces...');
  let provinceId = 1;
  provinces.forEach((provinceData, provinceName) => {
    const code = `RW-${provinceId.toString().padStart(2, '0')}`;
    const shortCode = provinceId.toString();
    const slug = generateUniqueSlug(provinceName, usedSlugs) || provinceId.toString();
    
    provincesData.push({
      id: provinceId,
      code,
      name: provinceName,
      slug,
      center: { lat: 0, lng: 0 },
      shortCode
    });
    
    provinceCodeMap.set(provinceName, code);
    usedSlugs.add(slug);
    provinceId++;
  });

  // Generate districts with old format: RW-D-XX
  console.log('Generating districts...');
  let districtId = 1;
  districts.forEach((districtData, districtKey) => {
    const code = `RW-D-${districtId.toString().padStart(2, '0')}`;
    const shortCode = districtId.toString().padStart(2, '0');
    const slug = generateUniqueSlug(districtData.name, usedSlugs) || districtId.toString();
    const provinceCode = provinceCodeMap.get(districtData.province);
    
    districtsData.push({
      id: districtId,
      code,
      name: districtData.name,
      slug,
      parentCode: provinceCode,
      center: { lat: 0, lng: 0 },
      shortCode
    });
    
    districtCodeMap.set(districtKey, code);
    usedSlugs.add(slug);
    districtId++;
  });

  // Generate sectors with old format: RW-S-XXX
  console.log('Generating sectors...');
  let sectorId = 1;
  sectors.forEach((sectorData, sectorKey) => {
    const code = `RW-S-${sectorId.toString().padStart(3, '0')}`;
    const shortCode = sectorId.toString().padStart(3, '0');
    const slug = generateUniqueSlug(sectorData.name, usedSlugs) || sectorId.toString();
    const districtCode = districtCodeMap.get(sectorData.district);
    
    sectorsData.push({
      id: sectorId,
      code,
      name: sectorData.name,
      slug,
      parentCode: districtCode,
      center: { lat: 0, lng: 0 },
      shortCode
    });
    
    sectorCodeMap.set(sectorKey, code);
    usedSlugs.add(slug);
    sectorId++;
  });

  // Generate cells with old format: RW-C-XXXX
  console.log('Generating cells...');
  let cellId = 1;
  cells.forEach((cellData, cellKey) => {
    const code = `RW-C-${cellId.toString().padStart(4, '0')}`;
    const shortCode = cellId.toString().padStart(4, '0');
    const slug = generateUniqueSlug(cellData.name, usedSlugs) || cellId.toString();
    const sectorCode = sectorCodeMap.get(cellData.sector);
    
    cellsData.push({
      id: cellId,
      code,
      name: cellData.name,
      slug,
      parentCode: sectorCode,
      center: { lat: 0, lng: 0 },
      shortCode
    });
    
    cellCodeMap.set(cellKey, code);
    usedSlugs.add(slug);
    cellId++;
  });

  // Generate villages with old format: RW-V-XXXXX, ensure exactly 14,837
  console.log('Generating villages...');
  let villageId = 1;
  const allVillages = Array.from(villages.values());
  const limitedVillages = allVillages.slice(0, 14837);
  limitedVillages.forEach((villageData) => {
    const code = `RW-V-${villageId.toString().padStart(5, '0')}`;
    const shortCode = villageId.toString().padStart(5, '0');
    const slug = generateUniqueSlug(villageData.name, usedSlugs) || villageId.toString();
    const cellCode = cellCodeMap.get(villageData.cell);
    
    villagesData.push({
      id: villageId,
      code,
      name: villageData.name,
      slug,
      parentCode: cellCode,
      center: { lat: 0, lng: 0 },
      shortCode
    });
    
    usedSlugs.add(slug);
    villageId++;
  });

  // Ensure data directory exists
  if (!fs.existsSync(PATHS.dataDir)) {
    fs.mkdirSync(PATHS.dataDir, { recursive: true });
  }

  // Write data files
  console.log('Writing data files...');

  fs.writeFileSync(path.join(PATHS.dataDir, 'provinces.json'), JSON.stringify(provincesData, null, 2));
  fs.writeFileSync(path.join(PATHS.dataDir, 'districts.json'), JSON.stringify(districtsData, null, 2));
  fs.writeFileSync(path.join(PATHS.dataDir, 'sectors.json'), JSON.stringify(sectorsData, null, 2));
  fs.writeFileSync(path.join(PATHS.dataDir, 'cells.json'), JSON.stringify(cellsData, null, 2));
  fs.writeFileSync(path.join(PATHS.dataDir, 'villages.json'), JSON.stringify(villagesData, null, 2));

  logSection('Data Generation Summary');
  console.log(`Provinces: ${provincesData.length}`);
  console.log(`Districts: ${districtsData.length}`);
  console.log(`Sectors: ${sectorsData.length}`);
  console.log(`Cells: ${cellsData.length}`);
  console.log(`Villages: ${villagesData.length}`);
  console.log(`Total: ${provincesData.length + districtsData.length + sectorsData.length + cellsData.length + villagesData.length} locations`);

  logSuccess('Data generation complete!');
  console.log('Files written to src/data/');
  console.log('Next: Run "npm run optimize-data" to compress the files');
}

main(); 