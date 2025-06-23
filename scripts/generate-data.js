const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting data extraction from locations.json.gz...');

// Read the locations.json.gz file
const locationsPath = path.join(__dirname, '..', 'locations.json.gz');
console.log('Reading locations.json.gz...');

if (!fs.existsSync(locationsPath)) {
  console.error('Error: locations.json.gz not found');
  console.log('Downloading from source repository...');
  
  // Download the file if it doesn't exist
  try {
    execSync('curl -H "Accept: application/vnd.github.v3.raw" -o locations.json.gz https://api.github.com/repos/jnkindi/rwanda-locations-json/contents/locations.json', { stdio: 'inherit' });
    console.log('✓ Downloaded locations.json.gz');
  } catch (error) {
    console.error('Error downloading locations.json.gz:', error.message);
    process.exit(1);
  }
}

// Parse the gzipped JSON file
let locations;
try {
  const compressedData = fs.readFileSync(locationsPath);
  const jsonData = execSync('gunzip -c', { input: compressedData, encoding: 'utf8' });
  locations = JSON.parse(jsonData);
} catch (error) {
  console.error('Error parsing locations.json.gz:', error.message);
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
  const slug = generateUniqueSlug(provinceName, usedSlugs);
  
  provincesData.push({
    id: provinceId,
    code,
    name: provinceName,
    slug,
    center: { lat: 0, lng: 0 },
    shortCode
  });
  
  // Store the generated code for parent references
  provinceCodeMap.set(provinceName, code);
  usedSlugs.add(slug);
  provinceId++;
});

// Generate districts with new format: RW-D-01, RW-D-02, etc.
console.log('Generating districts...');
let districtId = 1;
districts.forEach((districtData, districtKey) => {
  const provinceName = districtData.province;
  const provinceCode = provinceCodeMap.get(provinceName);
  const code = `RW-D-${districtId.toString().padStart(2, '0')}`;
  const shortCode = districtId.toString().padStart(2, '0');
  const slug = generateUniqueSlug(districtData.name, usedSlugs);
  
  districtsData.push({
    id: districtId,
    code,
    name: districtData.name,
    slug,
    parentCode: provinceCode,
    center: { lat: 0, lng: 0 },
    shortCode
  });
  
  // Store the generated code for parent references
  districtCodeMap.set(districtKey, code);
  usedSlugs.add(slug);
  districtId++;
});

// Generate sectors with new format: RW-S-001, RW-S-002, etc.
console.log('Generating sectors...');
let sectorId = 1;
sectors.forEach((sectorData, sectorKey) => {
  const districtCode = districtCodeMap.get(sectorData.district);
  const code = `RW-S-${sectorId.toString().padStart(3, '0')}`;
  const shortCode = sectorId.toString().padStart(3, '0');
  const slug = generateUniqueSlug(sectorData.name, usedSlugs);
  
  sectorsData.push({
    id: sectorId,
    code,
    name: sectorData.name,
    slug,
    parentCode: districtCode,
    center: { lat: 0, lng: 0 },
    shortCode
  });
  
  // Store the generated code for parent references
  sectorCodeMap.set(sectorKey, code);
  usedSlugs.add(slug);
  sectorId++;
});

// Generate cells with new format: RW-C-0001, RW-C-0002, etc.
console.log('Generating cells...');
let cellId = 1;
cells.forEach((cellData, cellKey) => {
  const sectorCode = sectorCodeMap.get(cellData.sector);
  const code = `RW-C-${cellId.toString().padStart(4, '0')}`;
  const shortCode = cellId.toString().padStart(4, '0');
  const slug = generateUniqueSlug(cellData.name, usedSlugs);
  
  cellsData.push({
    id: cellId,
    code,
    name: cellData.name,
    slug,
    parentCode: sectorCode,
    center: { lat: 0, lng: 0 },
    shortCode
  });
  
  // Store the generated code for parent references
  cellCodeMap.set(cellKey, code);
  usedSlugs.add(slug);
  cellId++;
});

// Generate villages with new format: RW-V-00001, RW-V-00002, etc.
console.log('Generating villages...');
let villageId = 1;
const validVillages = Array.from(villages.entries())
  .filter(([, villageData]) => villageData.name && villageData.name.trim() !== '') // Remove empty names
  .slice(0, 14837); // Ensure exact count

validVillages.forEach(([, villageData]) => {
  const cellCode = cellCodeMap.get(villageData.cell);
  const code = `RW-V-${villageId.toString().padStart(5, '0')}`;
  const shortCode = villageId.toString().padStart(5, '0');
  const slug = generateUniqueSlug(villageData.name, usedSlugs);
  
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

console.log(`Generated: ${provincesData.length} provinces, ${districtsData.length} districts, ${sectorsData.length} sectors, ${cellsData.length} cells, ${villagesData.length} villages`);

// Write data files
const dataDir = path.join(__dirname, '..', 'src', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'provinces.json'), JSON.stringify(provincesData, null, 2));
fs.writeFileSync(path.join(dataDir, 'districts.json'), JSON.stringify(districtsData, null, 2));
fs.writeFileSync(path.join(dataDir, 'sectors.json'), JSON.stringify(sectorsData, null, 2));
fs.writeFileSync(path.join(dataDir, 'cells.json'), JSON.stringify(cellsData, null, 2));
fs.writeFileSync(path.join(dataDir, 'villages.json'), JSON.stringify(villagesData, null, 2));

console.log('Data files generated successfully!');
console.log('Files saved to:', dataDir); 