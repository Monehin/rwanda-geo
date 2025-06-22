#!/usr/bin/env node

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');

// Remove old gzipped files
fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.json.gz')) {
    fs.unlinkSync(path.join(dataDir, file));
  }
});

console.log('Gzipping JSON data files...\n');

// Check if data directory exists
if (!fs.existsSync(dataDir)) {
  console.error('Error: src/data directory not found');
  process.exit(1);
}

let totalOriginalSize = 0;
let totalGzippedSize = 0;
let filesProcessed = 0;

// Process each JSON file
fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(dataDir, file);
    const gzPath = filePath + '.gz';
    
    try {
      const content = fs.readFileSync(filePath);
      const gzipped = zlib.gzipSync(content, { level: 9 }); // Maximum compression
      
      fs.writeFileSync(gzPath, gzipped);
      
      const originalSize = content.length;
      const gzippedSize = gzipped.length;
      const compressionRatio = ((originalSize - gzippedSize) / originalSize * 100).toFixed(1);
      
      totalOriginalSize += originalSize;
      totalGzippedSize += gzippedSize;
      filesProcessed++;
      
      console.log(`✓ ${file}: ${(originalSize / 1024).toFixed(1)}KB → ${(gzippedSize / 1024).toFixed(1)}KB (${compressionRatio}% smaller)`);
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error.message);
    }
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Files processed: ${filesProcessed}`);
console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
console.log(`Total gzipped size: ${(totalGzippedSize / 1024 / 1024).toFixed(2)}MB`);
console.log(`Overall compression: ${((totalOriginalSize - totalGzippedSize) / totalOriginalSize * 100).toFixed(1)}% smaller`);
console.log('='.repeat(50));

console.log('\nGzipped files are ready! You can now update your code to load .json.gz files.'); 