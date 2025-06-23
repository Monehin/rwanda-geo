#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const outputDir = path.join(__dirname, '..', 'src', 'data');

console.log('🔧 Optimizing data compression...\n');

// Function to optimize JSON data by removing unnecessary fields
function optimizeData(data) {
  return data.map(item => {
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
  });
}

// Function to compress with different algorithms
function compressWithAlgorithm(inputPath, outputPath, algorithm = 'gzip') {
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
  } catch {
    console.warn(`⚠️  ${algorithm} compression failed, falling back to gzip`);
    try {
      execSync(`gzip -9 -c "${inputPath}" > "${outputPath}"`, { stdio: 'inherit' });
      return true;
    } catch (fallbackError) {
      console.error(`❌ Compression failed: ${fallbackError.message}`);
      return false;
    }
  }
}

// Function to test different compression algorithms
function testCompressionAlgorithms(jsonPath, baseName) {
  const algorithms = ['gzip', 'brotli', 'zstd'];
  const results = [];
  
  console.log(`Testing compression for ${baseName}...`);
  
  for (const algorithm of algorithms) {
    const outputPath = path.join(outputDir, `${baseName}.${algorithm}`);
    
    if (compressWithAlgorithm(jsonPath, outputPath, algorithm)) {
      const stats = fs.statSync(outputPath);
      const originalSize = fs.statSync(jsonPath).size;
      const compressionRatio = ((originalSize - stats.size) / originalSize * 100).toFixed(1);
      
      results.push({
        algorithm,
        size: stats.size,
        compressionRatio: parseFloat(compressionRatio)
      });
      
      console.log(`  ${algorithm}: ${(stats.size / 1024).toFixed(1)}KB (${compressionRatio}% smaller)`);
    }
  }
  
  // Find the best compression
  const best = results.reduce((best, current) => 
    current.size < best.size ? current : best
  );
  
  console.log(`  ✅ Best: ${best.algorithm} (${(best.size / 1024).toFixed(1)}KB)\n`);
  
  // Clean up test files and keep only the best
  results.forEach(result => {
    if (result.algorithm !== best.algorithm) {
      const testPath = path.join(outputDir, `${baseName}.${result.algorithm}`);
      if (fs.existsSync(testPath)) {
        fs.unlinkSync(testPath);
      }
    }
  });
  
  // Rename best to .gz for compatibility
  const bestPath = path.join(outputDir, `${baseName}.${best.algorithm}`);
  const finalPath = path.join(outputDir, `${baseName}.json.gz`);
  
  if (fs.existsSync(finalPath)) {
    fs.unlinkSync(finalPath);
  }
  
  fs.renameSync(bestPath, finalPath);
  
  return best;
}

// Main optimization process
async function optimizeDataFiles() {
  const files = ['provinces', 'districts', 'sectors', 'cells', 'villages'];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const file of files) {
    const jsonPath = path.join(dataDir, `${file}.json`);
    
    if (!fs.existsSync(jsonPath)) {
      console.log(`⚠️  ${file}.json not found, skipping...`);
      continue;
    }
    
    const originalSize = fs.statSync(jsonPath).size;
    totalOriginalSize += originalSize;
    
    console.log(`📁 Processing ${file}.json (${(originalSize / 1024).toFixed(1)}KB)...`);
    
    // Read and optimize the data
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const optimizedData = optimizeData(data);
    
    // Write optimized JSON
    const optimizedJsonPath = path.join(outputDir, `${file}-optimized.json`);
    fs.writeFileSync(optimizedJsonPath, JSON.stringify(optimizedData));
    
    // Test different compression algorithms
    const bestResult = testCompressionAlgorithms(optimizedJsonPath, file);
    totalOptimizedSize += bestResult.size;
    
    // Clean up temporary optimized JSON
    fs.unlinkSync(optimizedJsonPath);
  }
  
  // Summary
  console.log('📊 Compression Summary:');
  console.log('='.repeat(50));
  console.log(`Original size: ${(totalOriginalSize / 1024).toFixed(1)}KB`);
  console.log(`Optimized size: ${(totalOptimizedSize / 1024).toFixed(1)}KB`);
  console.log(`Overall compression: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}% smaller`);
  console.log(`Size reduction: ${((totalOriginalSize - totalOptimizedSize) / 1024).toFixed(1)}KB`);
  
  // Calculate bundle size impact
  const currentBundleSize = 412; // Current bundle size in KB
  const estimatedNewBundleSize = currentBundleSize - ((totalOriginalSize - totalOptimizedSize) / 1024);
  
  console.log(`\n📦 Estimated new bundle size: ${estimatedNewBundleSize.toFixed(1)}KB`);
  console.log(`Bundle size reduction: ${(currentBundleSize - estimatedNewBundleSize).toFixed(1)}KB`);
  
  console.log('\n✅ Data optimization complete!');
}

// Run optimization
optimizeDataFiles().catch(console.error); 