import { readFileSync, existsSync } from 'fs';
import { gunzipSync } from 'zlib';
import { join } from 'path';

/**
 * Load and decompress a gzipped JSON file
 * @param filename - The name of the JSON file (without .gz extension)
 * @returns The parsed JSON data
 */
export function loadGzippedJson<T>(filename: string): T {
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