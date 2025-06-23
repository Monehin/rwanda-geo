#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Shared file paths
const PATHS = {
  projectRoot: path.join(__dirname, '..'),
  dataDir: path.join(__dirname, '..', 'src', 'data'),
  distDataDir: path.join(__dirname, '..', 'dist', 'data'),
  locationsGz: path.join(__dirname, '..', 'locations.json.gz'),
  locationsJson: path.join(__dirname, '..', 'locations.json')
};

// File operations
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function getFileSize(filePath) {
  if (!fileExists(filePath)) return 0;
  return fs.statSync(filePath).size;
}

function formatFileSize(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

// Compression utilities
function compressFile(inputPath, outputPath, algorithm = 'gzip') {
  try {
    switch (algorithm) {
      case 'gzip':
        execSync(`gzip -9 -c "${inputPath}" > "${outputPath}"`, { stdio: 'inherit' });
        break;
      case 'brotli':
        execSync(`brotli -Z -o "${outputPath}" "${inputPath}"`, { stdio: 'inherit' });
        break;
      case 'zstd':
        execSync(`zstd -19 -c "${inputPath}" > "${outputPath}"`, { stdio: 'inherit' });
        break;
      default:
        execSync(`gzip -9 -c "${inputPath}" > "${outputPath}"`, { stdio: 'inherit' });
    }
    return true;
  } catch (error) {
    console.warn(`⚠️  ${algorithm} compression failed: ${error.message}`);
    return false;
  }
}

function decompressFile(inputPath) {
  try {
    const compressedData = fs.readFileSync(inputPath);
    return execSync('gunzip -c', { input: compressedData, encoding: 'utf8' });
  } catch (error) {
    throw new Error(`Failed to decompress ${inputPath}: ${error.message}`);
  }
}

// Download utilities
function downloadLocationsFile() {
  console.log('📥 Downloading locations.json from source repository...');
  try {
    execSync('curl -H "Accept: application/vnd.github.v3.raw" -o locations.json https://api.github.com/repos/jnkindi/rwanda-locations-json/contents/locations.json', {
      stdio: 'inherit',
      cwd: PATHS.projectRoot
    });
    const size = getFileSize(PATHS.locationsJson);
    console.log(`✅ Downloaded locations.json (${formatFileSize(size)})`);
    return true;
  } catch (error) {
    console.error('❌ Error downloading locations.json:', error.message);
    return false;
  }
}

// Data loading utilities
function loadLocationsData() {
  console.log('Reading locations data...');
  
  // Try compressed file first
  if (fileExists(PATHS.locationsGz)) {
    try {
      const jsonData = decompressFile(PATHS.locationsGz);
      const data = JSON.parse(jsonData);
      console.log('✓ Successfully parsed locations.json.gz');
      return data;
    } catch (error) {
      console.error('Error parsing locations.json.gz:', error.message);
    }
  }
  
  // Try uncompressed file
  if (fileExists(PATHS.locationsJson)) {
    try {
      const jsonData = fs.readFileSync(PATHS.locationsJson, 'utf8');
      const data = JSON.parse(jsonData);
      console.log('✓ Successfully parsed locations.json');
      
      // Compress for future use
      compressFile(PATHS.locationsJson, PATHS.locationsGz);
      console.log('✓ Compressed locations.json to locations.json.gz');
      
      return data;
    } catch (error) {
      console.error('Error parsing locations.json:', error.message);
    }
  }
  
  // Download if neither exists
  console.log('Downloading from source repository...');
  if (downloadLocationsFile()) {
    try {
      const jsonData = fs.readFileSync(PATHS.locationsJson, 'utf8');
      const data = JSON.parse(jsonData);
      console.log('✓ Successfully parsed locations.json');
      
      // Compress for future use
      compressFile(PATHS.locationsJson, PATHS.locationsGz);
      console.log('✓ Compressed locations.json to locations.json.gz');
      
      return data;
    } catch (error) {
      console.error('Error parsing downloaded locations.json:', error.message);
    }
  }
  
  throw new Error('Failed to load locations data');
}

// Data optimization utilities
function optimizeDataItem(item) {
  const optimized = {
    code: item.code,
    name: item.name,
    slug: item.slug
  };
  
  // Only include parentCode if it exists
  if (item.parentCode) {
    optimized.parentCode = item.parentCode;
  }
  
  // Only include center coordinates if they exist and are valid
  if (item.center && typeof item.center.lat === 'number' && typeof item.center.lng === 'number') {
    optimized.center = {
      lat: Math.round(item.center.lat * 1000000) / 1000000, // Round to 6 decimal places
      lng: Math.round(item.center.lng * 1000000) / 1000000
    };
  }
  
  return optimized;
}

function optimizeDataArray(data) {
  return data.map(optimizeDataItem);
}

// Git utilities
function runGitCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function getLatestRemoteTag() {
  runGitCommand('git fetch --tags --force');
  return runGitCommand('git tag --list --sort=-v:refname | head -1');
}

function getTagCommit(tag) {
  return tag ? runGitCommand(`git rev-list -n 1 ${tag}`) : null;
}

function getHeadCommit() {
  return runGitCommand('git rev-parse HEAD');
}

// Logging utilities
function logSection(title) {
  console.log(`\n${title}`);
  console.log('='.repeat(title.length));
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
}

function logWarning(message) {
  console.log(`⚠️  ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

module.exports = {
  PATHS,
  fileExists,
  getFileSize,
  formatFileSize,
  compressFile,
  decompressFile,
  downloadLocationsFile,
  loadLocationsData,
  optimizeDataItem,
  optimizeDataArray,
  runGitCommand,
  getLatestRemoteTag,
  getTagCommit,
  getHeadCommit,
  logSection,
  logSuccess,
  logError,
  logWarning,
  logInfo
}; 