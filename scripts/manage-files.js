#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.join(__dirname, '..');
const dataDir = path.join(projectRoot, 'src', 'data');
const distDataDir = path.join(projectRoot, 'dist', 'data');
const locationsGzPath = path.join(projectRoot, 'locations.json.gz');
const locationsJsonPath = path.join(projectRoot, 'locations.json');

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
  console.log('📥 Downloading locations.json from source repository...\n');
  try {
    execSync('curl -H "Accept: application/vnd.github.v3.raw" -o locations.json https://api.github.com/repos/jnkindi/rwanda-locations-json/contents/locations.json', {
      stdio: 'inherit',
      cwd: projectRoot
    });
    const stats = fs.statSync(locationsJsonPath);
    console.log(`✅ Downloaded locations.json (${(stats.size / 1024).toFixed(1)}KB)`);
  } catch (error) {
    console.error('❌ Error downloading locations.json:', error.message);
    process.exit(1);
  }
}

function compressLocations() {
  console.log('🗜️  Compressing locations.json...\n');
  if (!fs.existsSync(locationsJsonPath)) {
    console.error('❌ Error: locations.json not found');
    console.log('💡 Run "locations:download" command first to get the file');
    process.exit(1);
  }
  try {
    execSync('gzip -9 locations.json', {
      stdio: 'inherit',
      cwd: projectRoot
    });
    const stats = fs.statSync(locationsGzPath);
    console.log(`✅ Compressed to locations.json.gz (${(stats.size / 1024).toFixed(1)}KB)`);
  } catch (error) {
    console.error('❌ Error compressing locations.json:', error.message);
    process.exit(1);
  }
}

function extractLocations() {
  console.log('📤 Extracting locations.json.gz...\n');
  if (!fs.existsSync(locationsGzPath)) {
    console.error('❌ Error: locations.json.gz not found');
    console.log('💡 Run "locations:download" and "locations:compress" commands first');
    process.exit(1);
  }
  try {
    execSync('gunzip -k locations.json.gz', {
      stdio: 'inherit',
      cwd: projectRoot
    });
    const stats = fs.statSync(locationsJsonPath);
    console.log(`✅ Extracted to locations.json (${(stats.size / 1024).toFixed(1)}KB)`);
  } catch (error) {
    console.error('❌ Error extracting locations.json.gz:', error.message);
    process.exit(1);
  }
}

function removeLocations() {
  console.log('🗑️  Removing uncompressed locations.json...\n');
  if (fs.existsSync(locationsJsonPath)) {
    try {
      fs.unlinkSync(locationsJsonPath);
      console.log('✅ Removed locations.json');
    } catch (error) {
      console.error('❌ Error removing locations.json:', error.message);
      process.exit(1);
    }
  } else {
    console.log('ℹ️  locations.json not found (already removed)');
  }
}

function showLocationsStatus() {
  console.log('📊 Locations Files Status:');
  console.log('='.repeat(50));
  const hasGz = fs.existsSync(locationsGzPath);
  const hasJson = fs.existsSync(locationsJsonPath);
  if (hasGz) {
    const gzStats = fs.statSync(locationsGzPath);
    console.log(`🗜️  locations.json.gz: ${(gzStats.size / 1024).toFixed(1)}KB`);
  } else {
    console.log('🗜️  locations.json.gz: (not found)');
  }
  if (hasJson) {
    const jsonStats = fs.statSync(locationsJsonPath);
    console.log(`📄 locations.json: ${(jsonStats.size / 1024).toFixed(1)}KB`);
  } else {
    console.log('📄 locations.json: (not found)');
  }
  console.log('\n💡 Mode:', hasJson ? 'Development (with uncompressed file)' : 'Production (gzipped only)');
  if (!hasGz && !hasJson) {
    console.log('\n⚠️  No locations files found. Run "locations:download" to get the source data.');
  }
}

function cleanLocations() {
  console.log('🧹 Cleaning locations files...\n');
  if (fs.existsSync(locationsJsonPath)) {
    try {
      fs.unlinkSync(locationsJsonPath);
      console.log('✅ Removed locations.json');
    } catch (error) {
      console.error('❌ Error removing locations.json:', error.message);
    }
  }
  if (fs.existsSync(locationsGzPath)) {
    const stats = fs.statSync(locationsGzPath);
    console.log(`✅ Verified locations.json.gz (${(stats.size / 1024).toFixed(1)}KB)`);
  } else {
    console.log('⚠️  locations.json.gz not found');
  }
  console.log('\n✅ Cleanup complete! Production mode: only compressed file remains.');
}

// --- Data files management ---
function getDataFiles() {
  const files = fs.existsSync(dataDir) ? fs.readdirSync(dataDir) : [];
  const gzFiles = files.filter(f => f.endsWith('.json.gz'));
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.endsWith('.gz'));
  return { gzFiles, jsonFiles };
}

function extractJsonFiles() {
  console.log('📤 Extracting .json files from .gz files...\n');
  const { gzFiles } = getDataFiles();
  let successCount = 0;
  gzFiles.forEach(gzFile => {
    const gzPath = path.join(dataDir, gzFile);
    const jsonFile = gzFile.replace('.gz', '');
    const jsonPath = path.join(dataDir, jsonFile);
    try {
      execSync(`gunzip -c "${gzPath}" > "${jsonPath}"`, { maxBuffer: 50 * 1024 * 1024 });
      console.log(`✓ Extracted ${jsonFile}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error extracting ${gzFile}:`, error.message);
    }
  });
  console.log(`\n✅ ${successCount} of ${gzFiles.length} files extracted successfully!`);
  if (successCount < gzFiles.length) {
    console.log('⚠️  Some files may be too large for your system memory.');
  }
  console.log('💡 You can now inspect or edit the data files.');
}

function removeJsonFiles() {
  console.log('🗑️  Removing .json files (keeping .gz files)...\n');
  const { jsonFiles } = getDataFiles();
  if (jsonFiles.length === 0) {
    console.log('No .json files to remove.');
    return;
  }
  jsonFiles.forEach(jsonFile => {
    const jsonPath = path.join(dataDir, jsonFile);
    try {
      fs.unlinkSync(jsonPath);
      console.log(`✓ Removed ${jsonFile}`);
    } catch (error) {
      console.error(`✗ Error removing ${jsonFile}:`, error.message);
    }
  });
  console.log('\n✅ All .json files removed!');
  console.log('💡 Production mode: only compressed files remain.');
}

function showDataStatus() {
  const { gzFiles, jsonFiles } = getDataFiles();
  console.log('📊 Data Files Status:');
  console.log('='.repeat(50));
  console.log('\n🗜️  Compressed files (.json.gz):');
  gzFiles.forEach(file => {
    const stats = fs.statSync(path.join(dataDir, file));
    console.log(`  ✓ ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
  });
  console.log('\n📄 Uncompressed files (.json):');
  if (jsonFiles.length === 0) {
    console.log('  (none - production mode)');
  } else {
    jsonFiles.forEach(file => {
      const stats = fs.statSync(path.join(dataDir, file));
      console.log(`  ✓ ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
    });
  }
  console.log('\n💡 Mode:', jsonFiles.length === 0 ? 'Production (gzipped only)' : 'Development (with uncompressed files)');
}

function cleanDataDirectory() {
  console.log('🧹 Cleaning data directory...\n');
  const { gzFiles, jsonFiles } = getDataFiles();
  if (jsonFiles.length > 0) {
    console.log('Removing .json files...');
    jsonFiles.forEach(jsonFile => {
      const jsonPath = path.join(dataDir, jsonFile);
      try {
        fs.unlinkSync(jsonPath);
        console.log(`✓ Removed ${jsonFile}`);
      } catch (error) {
        console.error(`✗ Error removing ${jsonFile}:`, error.message);
      }
    });
  }
  console.log('\nVerifying .gz files...');
  gzFiles.forEach(gzFile => {
    const gzPath = path.join(dataDir, gzFile);
    const stats = fs.statSync(gzPath);
    console.log(`✓ ${gzFile} (${(stats.size / 1024).toFixed(1)}KB)`);
  });
  console.log('\n✅ Data directory cleaned!');
  console.log('💡 Production mode: only compressed files remain.');
}

function showJsonFiles() {
  console.log('👀 Extracting .json files for temporary viewing...\n');
  const { gzFiles } = getDataFiles();
  gzFiles.forEach(gzFile => {
    const gzPath = path.join(dataDir, gzFile);
    const jsonFile = gzFile.replace('.gz', '');
    try {
      const data = JSON.parse(execSync(`gunzip -c "${gzPath}"`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }));
      console.log(`\n📄 ${jsonFile}:`);
      console.log('-'.repeat(30));
      if (Array.isArray(data)) {
        console.log(`Total items: ${data.length}`);
        if (data.length > 0) {
          console.log('Sample items:');
          data.slice(0, 3).forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.name} (${item.code})`);
          });
          if (data.length > 3) {
            console.log(`  ... and ${data.length - 3} more items`);
          }
        }
      } else {
        console.log('Data structure:', Object.keys(data));
      }
    } catch (error) {
      console.log(`\n📄 ${jsonFile}:`);
      console.log('-'.repeat(30));
      console.log(`⚠️  ${error.message}`);
      console.log('💡 Use "data:add" command to extract this file to disk for viewing.');
    }
  });
  console.log('\n💡 Use "data:add" command to extract files for editing, or "data:remove" to clean up.');
}

function copyGzData() {
  console.log('📁 Copying .json.gz files to dist/data...\n');
  if (!fs.existsSync(distDataDir)) {
    fs.mkdirSync(distDataDir, { recursive: true });
    console.log('✓ Created dist/data directory');
  }
  const files = fs.existsSync(dataDir) ? fs.readdirSync(dataDir).filter(f => f.endsWith('.json.gz')) : [];
  if (files.length === 0) {
    console.log('⚠️  No .json.gz files found in src/data/');
    process.exit(0);
  }
  let copiedCount = 0;
  files.forEach(file => {
    const srcPath = path.join(dataDir, file);
    const destPath = path.join(distDataDir, file);
    try {
      fs.copyFileSync(srcPath, destPath);
      const stats = fs.statSync(srcPath);
      console.log(`✓ Copied ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
      copiedCount++;
    } catch (error) {
      console.error(`✗ Error copying ${file}:`, error.message);
    }
  });
  console.log(`\n✅ Successfully copied ${copiedCount} of ${files.length} files to dist/data/`);
}

// --- Main execution ---
const command = process.argv[2];
if (!command || ['help', '-h', '--help'].includes(command)) {
  showUsage();
  process.exit(0);
}

switch (command) {
  // Locations source file management
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
  // Data files management
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
    console.error(`❌ Unknown command: ${command}`);
    showUsage();
    process.exit(1);
} 