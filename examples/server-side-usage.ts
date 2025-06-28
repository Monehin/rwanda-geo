/**
 * Server-Side Usage Examples for Rwanda-Geo
 * 
 * This file demonstrates how to use the rwanda-geo package in server-side environments.
 * The package cannot be used in client-side applications due to Node.js dependencies.
 */

import { 
  getAllProvinces, 
  getAllDistricts, 
  getDistrictsByProvince,
  searchByName,
  fuzzySearchByName,
  getHierarchy
} from 'rwanda-geo';

// ============================================================================
// Express.js Server Example
// ============================================================================

export function createExpressRoutes() {
  return {
    // Get all provinces
    '/api/provinces': (req: any, res: any) => {
      try {
        const provinces = getAllProvinces();
        res.json({
          success: true,
          data: provinces,
          count: provinces.length
        });
      } catch {
        res.status(500).json({
          success: false,
          error: 'Failed to load provinces'
        });
      }
    },

    // Get districts by province
    '/api/provinces/:provinceCode/districts': (req: any, res: any) => {
      try {
        const { provinceCode } = req.params;
        const districts = getDistrictsByProvince(provinceCode);
        
        if (districts.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Province not found'
          });
        }

        res.json({
          success: true,
          data: districts,
          count: districts.length
        });
      } catch {
        res.status(500).json({
          success: false,
          error: 'Failed to load districts'
        });
      }
    },

    // Search locations by name
    '/api/search': (req: any, res: any) => {
      try {
        const { q, fuzzy, limit = 10 } = req.query;
        
        if (!q) {
          return res.status(400).json({
            success: false,
            error: 'Query parameter "q" is required'
          });
        }

        let results;
        if (fuzzy === 'true') {
          results = fuzzySearchByName(q as string, 0.7, parseInt(limit as string));
        } else {
          results = searchByName(q as string);
        }

        res.json({
          success: true,
          data: results,
          count: results.length
        });
      } catch {
        res.status(500).json({
          success: false,
          error: 'Search failed'
        });
      }
    }
  };
}

// ============================================================================
// Next.js API Route Example
// ============================================================================

export async function nextApiHandler(req: any, res: any) {
  const { method, query } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    switch (query.endpoint) {
      case 'provinces': {
        const provinces = getAllProvinces();
        return res.json({ provinces });
      }

      case 'districts': {
        const districts = getAllDistricts();
        return res.json({ districts });
      }

      case 'search': {
        const { q } = query;
        if (!q) {
          return res.status(400).json({ error: 'Query parameter required' });
        }
        const results = searchByName(q);
        return res.json({ results });
      }

      default:
        return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ============================================================================
// Next.js Server Component Example
// ============================================================================

export async function getServerSideData() {
  // This function can be used in Next.js server components
  const provinces = getAllProvinces();
  const districts = getAllDistricts();
  
  return {
    provinces,
    districts,
    summary: {
      totalProvinces: provinces.length,
      totalDistricts: districts.length
    }
  };
}

// ============================================================================
// Data Processing Example
// ============================================================================

export function processLocationData() {
  const provinces = getAllProvinces();
  
  // Process data for specific use cases
  const provinceStats = provinces.map(province => {
    const districts = getDistrictsByProvince(province.code);
    
    return {
      ...province,
      districtCount: districts.length,
      districts: districts.map(d => ({ code: d.code, name: d.name }))
    };
  });

  return provinceStats;
}

// ============================================================================
// Validation Example
// ============================================================================

export function validateLocationData() {
  const provinces = getAllProvinces();
  const districts = getAllDistricts();
  
  const validation = {
    provinces: {
      count: provinces.length,
      expected: 5,
      valid: provinces.length === 5
    },
    districts: {
      count: districts.length,
      expected: 30,
      valid: districts.length === 30
    }
  };

  return {
    ...validation,
    overall: validation.provinces.valid && validation.districts.valid
  };
}

// ============================================================================
// Export for use in other files
// ============================================================================

export {
  getAllProvinces,
  getAllDistricts,
  getDistrictsByProvince,
  searchByName,
  fuzzySearchByName,
  getHierarchy
}; 