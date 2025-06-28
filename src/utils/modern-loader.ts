import { gunzipSync, brotliDecompressSync } from 'zlib';

// Cache for loaded data
const dataCache = new Map<string, any>();

/**
 * Try to decompress with Brotli, fall back to gzip if Brotli fails
 */
function decompressBuffer(buffer: Buffer): string {
  try {
    // Try Brotli first
    return brotliDecompressSync(buffer).toString('utf8');
  } catch {
    // Fallback to gzip
    return gunzipSync(buffer).toString('utf8');
  }
}

/**
 * Modern data loader that works in bundled environments
 * Uses embedded base64 data instead of file system access
 */
export function loadEmbeddedData<T>(filename: string): T {
  // Check cache first
  if (dataCache.has(filename)) {
    return dataCache.get(filename);
  }

  // Import the embedded data dynamically
  let data: T;
  
  try {
    // Dynamic import of embedded data
    const dataModule = require(`../data-embedded/${filename}.js`);
    const base64Data = dataModule.default || dataModule;
    
    // Decode base64 and decompress
    const buffer = Buffer.from(base64Data, 'base64');
    const decompressed = decompressBuffer(buffer);
    data = JSON.parse(decompressed);
    
    // Cache the result
    dataCache.set(filename, data);
    return data;
  } catch {
    // Fallback to legacy loader if embedded data is not available
    console.warn(`Embedded data not available for ${filename}, falling back to file system loader`);
    return loadLegacyData<T>(filename);
  }
}

/**
 * Legacy data loader for backward compatibility
 * Only used as fallback when embedded data is not available
 */
function loadLegacyData<T>(filename: string): T {
  try {
    const { readFileSync, existsSync } = require('fs');
    const { join, dirname } = require('path');
    
    // Try to find the package root
    let packageRoot: string;
    try {
      const packageJsonPath = require.resolve('rwanda-geo/package.json');
      packageRoot = dirname(packageJsonPath);
    } catch {
      // Fallback for development
      const currentDir = __dirname;
      const srcIndex = currentDir.indexOf('/src/');
      packageRoot = srcIndex !== -1 ? currentDir.substring(0, srcIndex) : process.cwd();
    }
    
    const paths = [
      join(packageRoot, 'dist/data', `${filename}.json.gz`),
      join(packageRoot, 'src/data', `${filename}.json.gz`),
      join(packageRoot, 'dist/data', `${filename}.json`),
      join(packageRoot, 'src/data', `${filename}.json`)
    ];

    for (const path of paths) {
      try {
        if (existsSync(path)) {
          if (path.endsWith('.gz')) {
            const gzipped = readFileSync(path);
            const decompressed = decompressBuffer(gzipped);
            const data = JSON.parse(decompressed);
            dataCache.set(filename, data);
            return data;
          } else {
            const content = readFileSync(path, 'utf8');
            const data = JSON.parse(content);
            dataCache.set(filename, data);
            return data;
          }
        }
      } catch {
        continue;
      }
    }
    
    throw new Error(`Failed to load ${filename} from any location`);
  } catch (error) {
    throw new Error(`Failed to load ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Preload specific data files for immediate access
 * @param filenames - Array of filenames to preload
 */
export function preloadData(filenames: string[]): void {
  filenames.forEach(filename => {
    if (!dataCache.has(filename)) {
      try {
        loadEmbeddedData(filename);
      } catch (error) {
        console.warn(`Failed to preload ${filename}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  });
}

/**
 * Clear the data cache to free memory
 */
export function clearDataCache(): void {
  dataCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: dataCache.size,
    keys: Array.from(dataCache.keys())
  };
} 