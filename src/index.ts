/**
 * Rwanda-Geo: Complete administrative divisions dataset for Rwanda
 * 
 * ⚠️ SERVER-SIDE ONLY PACKAGE
 * This package uses Node.js built-in modules (fs, zlib, path) and cannot be used
 * in client-side applications. Use in:
 * - Node.js servers
 * - Next.js server components and API routes
 * - Build-time data generation
 * 
 * For client-side usage, create API endpoints that use this package.
 */

export * from './types';
export * from './helpers';
export { loadGzippedJson, loadGzippedJsonSafe } from './utils/gzip-loader';

// ESM/Node compatibility
import * as helpers from './helpers';
import * as types from './types';
import { loadGzippedJson, loadGzippedJsonSafe } from './utils/gzip-loader';

export default {
  ...helpers,
  ...types,
  loadGzippedJson,
  loadGzippedJsonSafe,
}; 