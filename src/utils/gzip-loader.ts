import { readFileSync } from 'fs';
import { gunzipSync } from 'zlib';
import { join } from 'path';

/**
 * Load and decompress a gzipped JSON file
 * @param filename - The name of the JSON file (without .gz extension)
 * @returns The parsed JSON data
 */
export function loadGzippedJson<T>(filename: string): T {
  try {
    // Always resolve relative to dist/data
    const gzPath = join(process.cwd(), 'dist/data', `${filename}.json.gz`);
    const gzipped = readFileSync(gzPath);
    const decompressed = gunzipSync(gzipped);
    return JSON.parse(decompressed.toString('utf8'));
  } catch (error) {
    // Fallback to regular JSON if gzipped version doesn't exist
    try {
      const jsonPath = join(process.cwd(), 'dist/data', `${filename}.json`);
      const content = readFileSync(jsonPath, 'utf8');
      return JSON.parse(content);
    } catch (fallbackError) {
      throw new Error(`Failed to load ${filename}.json.gz or ${filename}.json: ${error instanceof Error ? error.message : 'Unknown error'} (fallback: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'})`);
    }
  }
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