import { readFileSync, existsSync } from 'fs';
import { gunzipSync } from 'zlib';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
function getModuleDir(): string {
  if (typeof __dirname !== 'undefined') {
    // CommonJS environment
    return __dirname;
  } else {
    // ESM environment
    return dirname(fileURLToPath(import.meta.url));
  }
}

function getDataPaths(filename: string): string[] {
  const moduleDir = getModuleDir();
  return [
    // Production: dist/data (when running from dist/index.js)
    join(moduleDir, 'data', `${filename}.json.gz`),
    join(moduleDir, 'data', `${filename}.json`),
    // Development: src/data (when running from src/index.ts)
    join(moduleDir, '../src/data', `${filename}.json.gz`),
    join(moduleDir, '../src/data', `${filename}.json`)
  ];
}

/**
 * Load and decompress a gzipped JSON file
 * @param filename - The name of the JSON file (without .gz extension)
 * @returns The parsed JSON data
 */
export function loadGzippedJson<T>(filename: string): T {
  const paths = getDataPaths(filename);

  for (const path of paths) {
    try {
      if (existsSync(path)) {
        if (path.endsWith('.gz')) {
          // Load and decompress gzipped file
          const gzipped = readFileSync(path);
          const decompressed = gunzipSync(gzipped);
          return JSON.parse(decompressed.toString('utf8'));
        } else {
          // Load regular JSON file
          const content = readFileSync(path, 'utf8');
          return JSON.parse(content);
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
 * Load and decompress a gzipped JSON file with error handling
 * @param filename - The name of the JSON file (without .gz extension)
 * @returns The parsed JSON data or null if loading fails
 */
export function loadGzippedJsonSafe<T>(filename: string): T | null {
  try {
    return loadGzippedJson<T>(filename);
  } catch (error) {
    console.warn(`Warning: Failed to load ${filename}.json.gz:`, error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
} 