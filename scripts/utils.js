#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

// Safe path validation
function validatePath(filePath) {
  const resolvedPath = path.resolve(filePath);
  const projectRoot = path.resolve(PATHS.projectRoot);
  
  // Ensure path is within project directory
  if (!resolvedPath.startsWith(projectRoot)) {
    throw new Error(`Path outside project directory: ${filePath}`);
  }
  
  // Check for suspicious characters
  if (filePath.includes('..') || filePath.includes(';') || filePath.includes('|') || filePath.includes('&')) {
    throw new Error(`Suspicious characters in path: ${filePath}`);
  }
  
  return resolvedPath;
}

// Compression utilities - using Node.js built-in zlib instead of shell commands
const zlib = require('zlib');
const { promisify } = require('util');
const gzip = promisify(zlib.gzip);

async function compressFile(inputPath, outputPath, algorithm = 'gzip') {
  try {
    // Validate paths
    const safeInputPath = validatePath(inputPath);
    const safeOutputPath = validatePath(outputPath);
    
    // Only support gzip for security (no shell commands)
    if (algorithm !== 'gzip') {
      console.warn(`⚠️  Only gzip compression is supported for security. Requested: ${algorithm}`);
      algorithm = 'gzip';
    }
    
    const inputData = fs.readFileSync(safeInputPath);
    const compressedData = await gzip(inputData, { level: 9 });
    fs.writeFileSync(safeOutputPath, compressedData);
    
    return true;
  } catch (error) {
    console.warn(`⚠️  ${algorithm} compression failed: ${error.message}`);
    return false;
  }
}

function decompressFile(inputPath) {
  try {
    const safeInputPath = validatePath(inputPath);
    const compressedData = fs.readFileSync(safeInputPath);
    const decompressedData = zlib.gunzipSync(compressedData);
    return decompressedData.toString('utf8');
  } catch (error) {
    throw new Error(`Failed to decompress ${inputPath}: ${error.message}`);
  }
}

// Download utilities - using Node.js built-in https instead of curl
const https = require('https');

function downloadLocationsFile() {
  console.log('📥 Downloading locations.json from source repository...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/repos/jnkindi/rwanda-locations-json/contents/locations.json',
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'rwanda-geo-package'
      }
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          fs.writeFileSync(PATHS.locationsJson, data);
          const size = getFileSize(PATHS.locationsJson);
          console.log(`✅ Downloaded locations.json (${formatFileSize(size)})`);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Data loading utilities
async function loadLocationsData() {
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
      await compressFile(PATHS.locationsJson, PATHS.locationsGz);
      console.log('✓ Compressed locations.json to locations.json.gz');
      
      return data;
    } catch (error) {
      console.error('Error parsing locations.json:', error.message);
    }
  }
  
  // Download if neither exists
  console.log('Downloading from source repository...');
  try {
    await downloadLocationsFile();
    const jsonData = fs.readFileSync(PATHS.locationsJson, 'utf8');
    const data = JSON.parse(jsonData);
    console.log('✓ Successfully parsed locations.json');
    
    // Compress for future use
    await compressFile(PATHS.locationsJson, PATHS.locationsGz);
    console.log('✓ Compressed locations.json to locations.json.gz');
    
    return data;
  } catch (error) {
    console.error('Error parsing downloaded locations.json:', error.message);
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

// Git utilities - REMOVED for security (no shell commands)
// If git functionality is needed, use a proper git library like 'simple-git'
function getLatestRemoteTag() {
  // Removed for security - no shell commands
  console.warn('⚠️  Git functionality removed for security');
  return null;
}

function getTagCommit() {
  // Removed for security - no shell commands
  console.warn('⚠️  Git functionality removed for security');
  return null;
}

function getHeadCommit() {
  // Removed for security - no shell commands
  console.warn('⚠️  Git functionality removed for security');
  return null;
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
  getLatestRemoteTag,
  getTagCommit,
  getHeadCommit,
  logSection,
  logSuccess,
  logError,
  logWarning,
  logInfo
}; 