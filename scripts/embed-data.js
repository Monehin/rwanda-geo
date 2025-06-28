const fs = require('fs');
const path = require('path');

/**
 * Convert gzipped data files to embedded JavaScript modules
 * This makes the package compatible with bundled environments
 */
function embedDataFiles() {
  console.log('🔧 Converting data files to embedded JavaScript modules...\n');
  
  const dataDir = path.join(__dirname, '../src/data');
  const embeddedDir = path.join(__dirname, '../src/data-embedded');
  
  // Create embedded directory if it doesn't exist
  if (!fs.existsSync(embeddedDir)) {
    fs.mkdirSync(embeddedDir, { recursive: true });
  }
  
  // Get all .gz files
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.gz'));
  
  files.forEach(file => {
    const filename = file.replace('.json.gz', '');
    const filePath = path.join(dataDir, file);
    
    try {
      // Read the gzipped file
      const gzippedData = fs.readFileSync(filePath);
      
      // Convert to base64
      const base64Data = gzippedData.toString('base64');
      
      // Create JavaScript module
      const jsContent = `// Auto-generated embedded data for ${filename}
// This file contains base64-encoded gzipped JSON data
export default "${base64Data}";
`;
      
      // Write the JavaScript module
      const jsFilePath = path.join(embeddedDir, `${filename}.js`);
      fs.writeFileSync(jsFilePath, jsContent);
      
      console.log(`✅ Converted ${file} -> ${filename}.js`);
    } catch (error) {
      console.error(`❌ Failed to convert ${file}:`, error.message);
    }
  });
  
  console.log(`\n📁 Embedded data files written to: ${embeddedDir}`);
  console.log('💡 These files will be used in bundled environments for better compatibility');
}

// Run the conversion
embedDataFiles(); 