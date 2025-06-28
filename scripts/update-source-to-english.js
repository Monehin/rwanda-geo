#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Province name mapping: Kinyarwanda -> English
const PROVINCE_MAPPING = {
  'Umujyi wa Kigali': 'Kigali City',
  'Amajyepfo': 'Southern Province',
  'Iburengerazuba': 'Western Province',
  'Amajyaruguru': 'Northern Province',
  'Iburasirazuba': 'Eastern Province'
};

function updateSourceToEnglish() {
  console.log('🔄 Updating source data to use English names as default...');
  
  const sourcePath = path.join(__dirname, '..', 'locations.json');
  const backupPath = path.join(__dirname, '..', 'locations.json.backup');
  
  // Create backup
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, backupPath);
    console.log('✅ Created backup: locations.json.backup');
  }
  
  // Read source data
  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  
  // Update province names
  sourceData.provinces.forEach(province => {
    const englishName = PROVINCE_MAPPING[province.name];
    if (englishName) {
      console.log(`🔄 Converting: "${province.name}" → "${englishName}"`);
      province.name = englishName;
    }
  });
  
  // Write updated data
  fs.writeFileSync(sourcePath, JSON.stringify(sourceData, null, 2));
  console.log('✅ Updated locations.json with English province names');
  
  // Compress the updated file
  const zlib = require('zlib');
  const gzipData = zlib.gzipSync(JSON.stringify(sourceData));
  const gzipPath = path.join(__dirname, '..', 'locations.json.gz');
  fs.writeFileSync(gzipPath, gzipData);
  console.log('✅ Compressed to locations.json.gz');
  
  console.log('\n📊 Summary:');
  console.log('- Source data now uses English names as default');
  console.log('- Backup created: locations.json.backup');
  console.log('- Both .json and .gz files updated');
  console.log('\n🔄 Next: Run "npm run build" to regenerate data files');
}

if (require.main === module) {
  updateSourceToEnglish();
}

module.exports = { updateSourceToEnglish }; 