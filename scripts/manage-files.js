#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { 
  PATHS, 
  fileExists, 
  getFileSize, 
  formatFileSize, 
  downloadLocationsFile, 
  compressFile, 
  logSection, 
  logSuccess, 
  logError, 
  logWarning, 
  logInfo 
} = require('./utils');

function showUsage() {
  console.log(`
Usage: node scripts/manage-files.js <command>

Locations source file management:
  locations:download   - Download locations.json from source repository
  locations:compress   - Compress locations.json to locations.json.gz
  locations:extract    - Extract locations.json.gz to locations.json
  locations:remove     - Remove locations.json (keep only compressed version)
  locations:status     - Show current status of locations files
  locations:clean      - Remove uncompressed file and ensure only .gz exists

Data files management:
  data:add             - Extract .json files from .gz for development
  data:remove          - Remove .json files (keep only .gz for production)
  data:status          - Show current status of data files
  data:clean           - Remove .json files and ensure only .gz files exist
  data:show            - Show a sample of each data file
  data:copy            - Copy .json.gz files to dist/data
`);
}

// --- Locations source file management ---
function downloadLocations() {
  logSection('Downloading locations.json');
  if (downloadLocationsFile()) {
    logSuccess('Download completed successfully');
  } else {
    logError('Download failed');
    process.exit(1);
  }
}

function compressLocations() {
  logSection('Compressing locations.json');
  if (!fileExists(PATHS.locationsJson)) {
    logError('locations.json not found');
    logInfo('Run "locations:download" command first to get the file');
    process.exit(1);
  }
  
  try {
    compressFile(PATHS.locationsJson, PATHS.locationsGz);
    const size = getFileSize(PATHS.locationsGz);
    logSuccess(`Compressed to locations.json.gz (${formatFileSize(size)})`);
  } catch (error) {
    logError(`Error compressing locations.json: ${error.message}`);
    process.exit(1);
  }
}

function extractLocations() {
  logSection('Extracting locations.json.gz');
  if (!fileExists(PATHS.locationsGz)) {
    logError('locations.json.gz not found');
    logInfo('Run "locations:download" and "locations:compress" commands first');
    process.exit(1);
  }
  
  try {
    const compressedData = fs.readFileSync(PATHS.locationsGz);
    const decompressedData = zlib.gunzipSync(compressedData);
    fs.writeFileSync(PATHS.locationsJson, decompressedData);
    
    const size = getFileSize(PATHS.locationsJson);
    logSuccess(`Extracted to locations.json (${formatFileSize(size)})`);
  } catch (error) {
    logError(`Error extracting locations.json.gz: ${error.message}`);
    process.exit(1);
  }
}

function removeLocations() {
  logSection('Removing uncompressed locations.json');
  if (fileExists(PATHS.locationsJson)) {
    try {
      fs.unlinkSync(PATHS.locationsJson);
      logSuccess('Removed locations.json');
    } catch (error) {
      logError(`Error removing locations.json: ${error.message}`);
      process.exit(1);
    }
  } else {
    logInfo('locations.json not found (already removed)');
  }
}

function showLocationsStatus() {
  logSection('Locations Files Status');
  const hasGz = fileExists(PATHS.locationsGz);
  const hasJson = fileExists(PATHS.locationsJson);
  
  if (hasGz) {
    const gzSize = getFileSize(PATHS.locationsGz);
    console.log(`🗜️  locations.json.gz: ${formatFileSize(gzSize)}`);
  } else {
    console.log('🗜️  locations.json.gz: (not found)');
  }
  
  if (hasJson) {
    const jsonSize = getFileSize(PATHS.locationsJson);
    console.log(`📄 locations.json: ${formatFileSize(jsonSize)}`);
  } else {
    console.log('📄 locations.json: (not found)');
  }
  
  console.log('\n💡 Mode:', hasJson ? 'Development (with uncompressed file)' : 'Production (gzipped only)');
  if (!hasGz && !hasJson) {
    console.log('\n⚠️  No locations files found. Run "locations:download" to get the source data.');
  }
}

function cleanLocations() {
  logSection('Cleaning locations files');
  if (fileExists(PATHS.locationsJson)) {
    try {
      fs.unlinkSync(PATHS.locationsJson);
      logSuccess('Removed locations.json');
    } catch (error) {
      logError(`Error removing locations.json: ${error.message}`);
    }
  }
  
  if (fileExists(PATHS.locationsGz)) {
    const size = getFileSize(PATHS.locationsGz);
    logSuccess(`Verified locations.json.gz (${formatFileSize(size)})`);
  } else {
    logWarning('locations.json.gz not found');
  }
  
  logSuccess('Cleanup complete! Production mode: only compressed file remains.');
}

// --- Data files management ---
function getDataFiles() {
  const files = fileExists(PATHS.dataDir) ? fs.readdirSync(PATHS.dataDir) : [];
  const gzFiles = files.filter(f => f.endsWith('.json.gz'));
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.endsWith('.gz'));
  return { gzFiles, jsonFiles };
}

function extractJsonFiles() {
  logSection('Extracting .json files from .gz files');
  const { gzFiles } = getDataFiles();
  let successCount = 0;
  
  gzFiles.forEach(gzFile => {
    const gzPath = path.join(PATHS.dataDir, gzFile);
    const jsonFile = gzFile.replace('.gz', '');
    const jsonPath = path.join(PATHS.dataDir, jsonFile);
    
    try {
      const compressedData = fs.readFileSync(gzPath);
      const decompressedData = zlib.gunzipSync(compressedData);
      fs.writeFileSync(jsonPath, decompressedData);
      
      console.log(`✓ Extracted ${jsonFile}`);
      successCount++;
    } catch (error) {
      logError(`Error extracting ${gzFile}: ${error.message}`);
    }
  });
  
  console.log(`\n✅ ${successCount} of ${gzFiles.length} files extracted successfully!`);
  if (successCount < gzFiles.length) {
    logWarning('Some files may be too large for your system memory.');
  }
  logInfo('You can now inspect or edit the data files.');
}

function removeJsonFiles() {
  logSection('Removing .json files (keeping .gz files)');
  const { jsonFiles } = getDataFiles();
  
  if (jsonFiles.length === 0) {
    logInfo('No .json files to remove.');
    return;
  }
  
  jsonFiles.forEach(jsonFile => {
    const jsonPath = path.join(PATHS.dataDir, jsonFile);
    try {
      fs.unlinkSync(jsonPath);
      console.log(`✓ Removed ${jsonFile}`);
    } catch (error) {
      logError(`Error removing ${jsonFile}: ${error.message}`);
    }
  });
  
  logSuccess('All .json files removed!');
  logInfo('Production mode: only compressed files remain.');
}

function showDataStatus() {
  const { gzFiles, jsonFiles } = getDataFiles();
  
  logSection('Data Files Status');
  console.log(`📁 Data directory: ${PATHS.dataDir}`);
  console.log(`🗜️  Compressed files (.json.gz): ${gzFiles.length}`);
  console.log(`📄 Uncompressed files (.json): ${jsonFiles.length}`);
  
  if (gzFiles.length > 0) {
    console.log('\n🗜️  Compressed files:');
    gzFiles.forEach(file => {
      const filePath = path.join(PATHS.dataDir, file);
      const size = getFileSize(filePath);
      console.log(`   ${file}: ${formatFileSize(size)}`);
    });
  }
  
  if (jsonFiles.length > 0) {
    console.log('\n📄 Uncompressed files:');
    jsonFiles.forEach(file => {
      const filePath = path.join(PATHS.dataDir, file);
      const size = getFileSize(filePath);
      console.log(`   ${file}: ${formatFileSize(size)}`);
    });
  }
  
  console.log('\n💡 Mode:', jsonFiles.length > 0 ? 'Development (with uncompressed files)' : 'Production (gzipped only)');
}

function cleanDataDirectory() {
  logSection('Cleaning data directory');
  const { jsonFiles } = getDataFiles();
  
  if (jsonFiles.length === 0) {
    logInfo('No .json files to remove.');
  } else {
    jsonFiles.forEach(jsonFile => {
      const jsonPath = path.join(PATHS.dataDir, jsonFile);
      try {
        fs.unlinkSync(jsonPath);
        console.log(`✓ Removed ${jsonFile}`);
      } catch (error) {
        logError(`Error removing ${jsonFile}: ${error.message}`);
      }
    });
  }
  
  const { gzFiles } = getDataFiles();
  if (gzFiles.length > 0) {
    console.log('\n✅ Verified compressed files:');
    gzFiles.forEach(file => {
      const filePath = path.join(PATHS.dataDir, file);
      const size = getFileSize(filePath);
      console.log(`   ${file}: ${formatFileSize(size)}`);
    });
  }
  
  logSuccess('Cleanup complete! Production mode: only compressed files remain.');
}

function showJsonFiles() {
  logSection('Data Files Sample');
  const { jsonFiles } = getDataFiles();
  
  if (jsonFiles.length === 0) {
    logInfo('No .json files found. Run "data:add" to extract files for inspection.');
    return;
  }
  
  jsonFiles.forEach(jsonFile => {
    const jsonPath = path.join(PATHS.dataDir, jsonFile);
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const size = getFileSize(jsonPath);
      console.log(`\n📄 ${jsonFile} (${formatFileSize(size)}):`);
      console.log(`   Records: ${data.length}`);
      if (data.length > 0) {
        console.log(`   Sample: ${JSON.stringify(data[0], null, 2).split('\n').slice(0, 3).join('\n      ')}...`);
      }
    } catch (error) {
      logError(`Error reading ${jsonFile}: ${error.message}`);
    }
  });
}

function copyGzData() {
  logSection('Copying .json.gz files to dist/data');
  
  // Ensure dist/data directory exists
  if (!fileExists(PATHS.distDataDir)) {
    fs.mkdirSync(PATHS.distDataDir, { recursive: true });
    logInfo('Created dist/data directory');
  }
  
  const { gzFiles } = getDataFiles();
  let successCount = 0;
  
  gzFiles.forEach(gzFile => {
    const srcPath = path.join(PATHS.dataDir, gzFile);
    const destPath = path.join(PATHS.distDataDir, gzFile);
    
    try {
      fs.copyFileSync(srcPath, destPath);
      const size = getFileSize(destPath);
      console.log(`✓ Copied ${gzFile} (${formatFileSize(size)})`);
      successCount++;
    } catch (error) {
      logError(`Error copying ${gzFile}: ${error.message}`);
    }
  });
  
  if (successCount > 0) {
    logSuccess(`${successCount} files copied to dist/data/`);
  } else {
    logWarning('No .json.gz files found to copy');
  }
}

// --- Main command handler ---
function main() {
  const command = process.argv[2];
  
  if (!command) {
    showUsage();
    process.exit(1);
  }
  
  switch (command) {
    // Locations commands
    case 'locations:download':
      downloadLocations();
      break;
    case 'locations:compress':
      compressLocations();
      break;
    case 'locations:extract':
      extractLocations();
      break;
    case 'locations:remove':
      removeLocations();
      break;
    case 'locations:status':
      showLocationsStatus();
      break;
    case 'locations:clean':
      cleanLocations();
      break;
    
    // Data commands
    case 'data:add':
      extractJsonFiles();
      break;
    case 'data:remove':
      removeJsonFiles();
      break;
    case 'data:status':
      showDataStatus();
      break;
    case 'data:clean':
      cleanDataDirectory();
      break;
    case 'data:show':
      showJsonFiles();
      break;
    case 'data:copy':
      copyGzData();
      break;
    
    default:
      logError(`Unknown command: ${command}`);
      showUsage();
      process.exit(1);
  }
}

main(); 