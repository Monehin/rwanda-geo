import { readFileSync, existsSync } from 'fs';
import { gunzipSync, brotliDecompressSync } from 'zlib';
import { join, dirname } from 'path';

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
 * Get the package's own directory (not the consumer's project directory)
 * This works for both ESM and CommonJS environments
 */
function getPackageRoot(): string {
  try {
    // Use require.resolve to find the package's own directory
    // This works when the package is installed as a dependency
    const packageJsonPath = require.resolve('rwanda-geo/package.json');
    return dirname(packageJsonPath);
  } catch (error) {
    // If we can't resolve the package, we're likely in development mode
    // In this case, use __dirname to get the current module's directory
    // and navigate to the package root
    const currentDir = __dirname;
    const srcIndex = currentDir.indexOf('/src/');
    if (srcIndex !== -1) {
      return currentDir.substring(0, srcIndex);
    }
    
    // Try to find the package root by looking for our specific files
    let currentDir2 = process.cwd();
    while (currentDir2 !== dirname(currentDir2)) {
      if (existsSync(join(currentDir2, 'package.json'))) {
        // Check if this is our package by looking for our specific files
        if (existsSync(join(currentDir2, 'dist', 'data', 'provinces.json.gz'))) {
          return currentDir2;
        }
      }
      currentDir2 = dirname(currentDir2);
    }
    
    // Last resort: throw an error instead of falling back to process.cwd()
    throw new Error(`Could not determine package root. This package must be properly installed or run from its own directory. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Lazy load and cache gzipped (Brotli or gzip) JSON data
 * @param filename - The name of the JSON file (without .gz extension)
 * @returns The parsed JSON data
 */
export function lazyLoadGzippedJson<T>(filename: string): T {
  // Check cache first
  if (dataCache.has(filename)) {
    return dataCache.get(filename);
  }

  const packageRoot = getPackageRoot();
  
  // Only look in the package's own directory, never in consumer project directories
  const paths = [
    join(packageRoot, 'dist/data', `${filename}.json.gz`), // Production (published package)
    join(packageRoot, 'src/data', `${filename}.json.gz`),  // Development
    join(packageRoot, 'dist/data', `${filename}.json`),    // Production fallback
    join(packageRoot, 'src/data', `${filename}.json`)      // Development fallback
  ];

  for (const path of paths) {
    try {
      if (existsSync(path)) {
        if (path.endsWith('.gz')) {
          // Load and decompress (Brotli or gzip) file
          const gzipped = readFileSync(path);
          const decompressed = decompressBuffer(gzipped);
          const data = JSON.parse(decompressed);
          dataCache.set(filename, data);
          return data;
        } else {
          // Load regular JSON file
          const content = readFileSync(path, 'utf8');
          const data = JSON.parse(content);
          dataCache.set(filename, data);
          return data;
        }
      }
    } catch {
      // Continue to next path if this one fails
      continue;
    }
  }

  // If all paths fail, throw a clear error
  throw new Error(`Failed to load ${filename}.json.gz or ${filename}.json from package directory: ${packageRoot}. Tried paths: ${paths.join(', ')}`);
}

/**
 * Preload specific data files for immediate access
 * @param filenames - Array of filenames to preload
 */
export function preloadData(filenames: string[]): void {
  filenames.forEach(filename => {
    if (!dataCache.has(filename)) {
      try {
        lazyLoadGzippedJson(filename);
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