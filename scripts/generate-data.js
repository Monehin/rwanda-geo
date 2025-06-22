const fs = require('fs');
const path = require('path');

console.log('Starting data extraction from locations.json...');

// Read the locations.json file
const locationsPath = path.join(__dirname, '..', 'locations.json');
console.log('Reading locations.json...');

if (!fs.existsSync(locationsPath)) {
  console.error('Error: locations.json not found');
  process.exit(1);
}

const locations = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));

// Helper to generate official-style codes with regex compliance
function generateOfficialCodeSimple(name, prefix = 'RW') {
  // Remove common words and create abbreviation
  const cleanName = name.replace(/\b(wa|ya|za|ka|ki|mu|ru|ga|gi|ny|am|aj|ep|fo|nz|an)\b/gi, '').trim();
  const words = cleanName.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return `${prefix}-UNK`;
  }
  
  // Take first 3 letters of first word, ensure it's uppercase letters only
  let code = words[0].substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  
  // If we don't have 3 letters, pad with 'X'
  while (code.length < 3) {
    code += 'X';
  }
  
  return `${prefix}-${code}`;
}

// Helper to generate unique letter-only codes for sectors, cells, villages
function generateLetterCode(name, existingCodes = new Set()) {
  // Remove common words and create abbreviation
  const cleanName = name.replace(/\b(wa|ya|za|ka|ki|mu|ru|ga|gi|ny|am|aj|ep|fo|nz|an)\b/gi, '').trim();
  const words = cleanName.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return 'UNK';
  }
  
  // Take first 3 letters of first word, ensure it's uppercase letters only
  let code = words[0].substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  
  // If we don't have 3 letters, pad with 'X'
  while (code.length < 3) {
    code += 'X';
  }
  
  // If code already exists, try variations
  let counter = 1;
  let originalCode = code;
  while (existingCodes.has(code)) {
    // Try different combinations of letters from the name
    if (words.length > 1 && counter <= words.length) {
      const word = words[counter - 1];
      code = word.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
      while (code.length < 3) {
        code += 'X';
      }
    } else {
      // Use letters from the original word in different combinations
      const letters = originalCode.split('');
      if (letters.length >= 3) {
        code = letters[0] + letters[2] + letters[1]; // Rearrange letters
      } else {
        code = originalCode + String.fromCharCode(65 + (counter % 26)); // Add letter
      }
    }
    counter++;
    if (counter > 100) break; // Prevent infinite loop
  }
  
  return code;
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

// Generate data with proper codes and ensure exact counts
const provincesData = [];
const districtsData = [];
const sectorsData = [];
const cellsData = [];
const villagesData = [];

// Track used codes and slugs for uniqueness
const usedCodes = new Set();
const usedSlugs = new Set();

// Maps to store generated codes for parent references
const provinceCodeMap = new Map(); // provinceName -> code
const districtCodeMap = new Map(); // districtKey -> code
const sectorCodeMap = new Map();   // sectorKey -> code
const cellCodeMap = new Map();     // cellKey -> code

// Helper to make a globally unique code
function makeGloballyUniqueCode(baseCode, shortCode, usedCodes) {
  let code = baseCode;
  let counter = 1;
  while (usedCodes.has(code)) {
    // Append shortCode or counter, keeping regex compliance
    code = `${baseCode}${shortCode ? '-' + shortCode : '-' + counter}`;
    counter++;
  }
  usedCodes.add(code);
  return code;
}

// Generate provinces
console.log('Generating provinces...');
let provinceId = 1;
provinces.forEach((provinceData, provinceName) => {
  const codeBase = generateOfficialCodeSimple(provinceName, 'RW');
  const shortCode = String(provinceId).padStart(1, '0');
  const code = makeGloballyUniqueCode(codeBase, shortCode, usedCodes);
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

// Generate districts
console.log('Generating districts...');
let districtId = 1;
districts.forEach((districtData, districtKey) => {
  const provinceName = districtData.province;
  const provinceCode = provinceCodeMap.get(provinceName);
  const districtCodeBase = generateLetterCode(districtData.name);
  const shortCode = String(districtId).padStart(2, '0');
  const code = makeGloballyUniqueCode(`${provinceCode}-${districtCodeBase}`, shortCode, usedCodes);
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

// Generate sectors
console.log('Generating sectors...');
let sectorId = 1;
const sectorCodes = new Set();
sectors.forEach((sectorData, sectorKey) => {
  const districtCode = districtCodeMap.get(sectorData.district);
  const sectorCodeBase = generateLetterCode(sectorData.name, sectorCodes);
  const shortCode = String(sectorId).padStart(3, '0');
  const code = makeGloballyUniqueCode(`${districtCode}-${sectorCodeBase}`, shortCode, usedCodes);
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
  sectorCodes.add(sectorCodeBase);
  sectorId++;
});

// Generate cells
console.log('Generating cells...');
let cellId = 1;
const cellCodes = new Set();
cells.forEach((cellData, cellKey) => {
  const sectorCode = sectorCodeMap.get(cellData.sector);
  const cellCodeBase = generateLetterCode(cellData.name, cellCodes);
  const shortCode = String(cellId).padStart(4, '0');
  const code = makeGloballyUniqueCode(`${sectorCode}-${cellCodeBase}`, shortCode, usedCodes);
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
  cellCodes.add(cellCodeBase);
  cellId++;
});

// Generate villages (ensure exact count of 14,837)
console.log('Generating villages...');
let villageId = 1;
const villageCodes = new Set();
const validVillages = Array.from(villages.entries())
  .filter(([, villageData]) => villageData.name && villageData.name.trim() !== '') // Remove empty names
  .slice(0, 14837); // Ensure exact count

validVillages.forEach(([, villageData]) => {
  const cellCode = cellCodeMap.get(villageData.cell);
  const villageCodeBase = generateLetterCode(villageData.name, villageCodes);
  const shortCode = String(villageId).padStart(5, '0');
  const code = makeGloballyUniqueCode(`${cellCode}-${villageCodeBase}`, shortCode, usedCodes);
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
  villageCodes.add(villageCodeBase);
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