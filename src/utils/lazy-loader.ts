import { readFileSync, existsSync } from 'fs';
import { gunzipSync, brotliDecompressSync } from 'zlib';
import { join } from 'path';

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
 * Lazy load and cache gzipped (Brotli or gzip) JSON data
 * @param filename - The name of the JSON file (without .gz extension)
 * @returns The parsed JSON data
 */
export function lazyLoadGzippedJson<T>(filename: string): T {
  // Check cache first
  if (dataCache.has(filename)) {
    return dataCache.get(filename);
  }

  // Try multiple paths in order of preference
  const paths = [
    join(process.cwd(), 'src/data', `${filename}.json.gz`),  // Development
    join(process.cwd(), 'dist/data', `${filename}.json.gz`), // Production
    join(process.cwd(), 'src/data', `${filename}.json`),     // Fallback JSON
    join(process.cwd(), 'dist/data', `${filename}.json`)     // Production fallback
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

  // If all paths fail, throw an error
  throw new Error(`Failed to load ${filename}.json.gz or ${filename}.json from any of the expected locations: ${paths.join(', ')}`);
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