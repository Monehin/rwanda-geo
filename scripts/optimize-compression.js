#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { 
  PATHS, 
  compressFile, 
  optimizeDataArray, 
  logSection, 
  logSuccess, 
  logWarning 
} = require('./utils');

console.log('🔧 Optimizing data compression...\n');

// Function to compress with gzip (always use gzip for .json.gz files)
function compressWithGzip(jsonPath, baseName) {
  const outputPath = path.join(PATHS.dataDir, `${baseName}.json.gz`);
  
  console.log(`Compressing ${baseName} with gzip...`);
  
  if (compressFile(jsonPath, outputPath, 'gzip')) {
    const stats = fs.statSync(outputPath);
    const originalSize = fs.statSync(jsonPath).size;
    const compressionRatio = ((originalSize - stats.size) / originalSize * 100).toFixed(1);
    
    console.log(`  gzip: ${(stats.size / 1024).toFixed(1)}KB (${compressionRatio}% smaller)\n`);
    
    return {
      algorithm: 'gzip',
      size: stats.size,
      compressionRatio: parseFloat(compressionRatio)
    };
  }
  
  return null;
}

// Main optimization process
async function optimizeDataFiles() {
  const files = ['provinces', 'districts', 'sectors', 'cells', 'villages'];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const file of files) {
    const jsonPath = path.join(PATHS.dataDir, `${file}.json`);
    
    if (!fs.existsSync(jsonPath)) {
      logWarning(`${file}.json not found, skipping...`);
      continue;
    }
    
    const originalSize = fs.statSync(jsonPath).size;
    totalOriginalSize += originalSize;
    
    console.log(`📁 Processing ${file}.json (${(originalSize / 1024).toFixed(1)}KB)...`);
    
    // Read and optimize the data
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const optimizedData = optimizeDataArray(data);
    
    // Write optimized JSON
    const optimizedJsonPath = path.join(PATHS.dataDir, `${file}-optimized.json`);
    fs.writeFileSync(optimizedJsonPath, JSON.stringify(optimizedData));
    
    // Compress with gzip (always use gzip for .json.gz files)
    const result = compressWithGzip(optimizedJsonPath, file);
    if (result) {
      totalOptimizedSize += result.size;
    }
    
    // Clean up temporary optimized JSON
    fs.unlinkSync(optimizedJsonPath);
  }
  
  // Summary
  logSection('Compression Summary');
  console.log(`Original size: ${(totalOriginalSize / 1024).toFixed(1)}KB`);
  console.log(`Optimized size: ${(totalOptimizedSize / 1024).toFixed(1)}KB`);
  console.log(`Overall compression: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}% smaller`);
  console.log(`Size reduction: ${((totalOriginalSize - totalOptimizedSize) / 1024).toFixed(1)}KB`);
  
  // Calculate bundle size impact
  const currentBundleSize = 412; // Current bundle size in KB
  const estimatedNewBundleSize = currentBundleSize - ((totalOriginalSize - totalOptimizedSize) / 1024);
  
  console.log(`\n📦 Estimated new bundle size: ${estimatedNewBundleSize.toFixed(1)}KB`);
  console.log(`Bundle size reduction: ${(currentBundleSize - estimatedNewBundleSize).toFixed(1)}KB`);
  
  logSuccess('Data optimization complete!');
}

// Run optimization
optimizeDataFiles().catch(console.error); 