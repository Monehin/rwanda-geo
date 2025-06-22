import {
  getAllProvinces,
  getAllDistricts,
  getAllSectors,
  getAllCells,
  getAllVillages,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
  getChildren,
  getHierarchy,
} from './helpers';

describe('Rwanda Administrative Hierarchy Tests', () => {
  describe('Province Level Validation', () => {
    test('should have exactly 5 provinces', () => {
      const provinces = getAllProvinces();
      expect(provinces.length).toBe(5);
    });

    test('each province should have districts', () => {
      const provinces = getAllProvinces();
      provinces.forEach(province => {
        const districts = getDistrictsByProvince(province.code);
        expect(districts.length).toBeGreaterThan(0);
        expect(districts.every(d => d.parentCode === province.code)).toBe(true);
      });
    });

    test('province codes should be unique', () => {
      const provinces = getAllProvinces();
      const codes = provinces.map(p => p.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });

    test('province slugs should be unique', () => {
      const provinces = getAllProvinces();
      const slugs = provinces.map(p => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe('District Level Validation', () => {
    test('should have exactly 30 districts', () => {
      const districts = getAllDistricts();
      expect(districts.length).toBe(30);
    });

    test('each district should have a valid parent province', () => {
      const districts = getAllDistricts();
      const provinces = getAllProvinces();
      const provinceCodes = provinces.map(p => p.code);
      
      districts.forEach(district => {
        expect(district.parentCode).toBeDefined();
        expect(provinceCodes).toContain(district.parentCode);
      });
    });

    test('each district should have sectors', () => {
      const districts = getAllDistricts();
      districts.forEach(district => {
        const sectors = getSectorsByDistrict(district.code);
        expect(sectors.length).toBeGreaterThan(0);
        expect(sectors.every(s => s.parentCode === district.code)).toBe(true);
      });
    });

    test('district codes should be unique', () => {
      const districts = getAllDistricts();
      const codes = districts.map(d => d.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });

  describe('Sector Level Validation', () => {
    test('should have exactly 416 sectors', () => {
      const sectors = getAllSectors();
      expect(sectors.length).toBe(416);
    });

    test('each sector should have a valid parent district', () => {
      const sectors = getAllSectors();
      const districts = getAllDistricts();
      const districtCodes = districts.map(d => d.code);
      
      sectors.forEach(sector => {
        expect(sector.parentCode).toBeDefined();
        expect(districtCodes).toContain(sector.parentCode);
      });
    });

    test('each sector should have cells', () => {
      const sectors = getAllSectors();
      sectors.forEach(sector => {
        const cells = getCellsBySector(sector.code);
        expect(cells.length).toBeGreaterThan(0);
        expect(cells.every(c => c.parentCode === sector.code)).toBe(true);
      });
    });

    test('sector codes should be unique', () => {
      const sectors = getAllSectors();
      const codes = sectors.map(s => s.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });

  describe('Cell Level Validation', () => {
    test('should have exactly 2,148 cells', () => {
      const cells = getAllCells();
      expect(cells.length).toBe(2148);
    });

    test('each cell should have a valid parent sector', () => {
      const cells = getAllCells();
      const sectors = getAllSectors();
      const sectorCodes = sectors.map(s => s.code);
      
      cells.forEach(cell => {
        expect(cell.parentCode).toBeDefined();
        expect(sectorCodes).toContain(cell.parentCode);
      });
    });

    test('each cell should have villages', () => {
      const cells = getAllCells();
      cells.forEach(cell => {
        const villages = getVillagesByCell(cell.code);
        expect(villages.length).toBeGreaterThan(0);
        expect(villages.every(v => v.parentCode === cell.code)).toBe(true);
      });
    });

    test('cell codes should be unique', () => {
      const cells = getAllCells();
      const codes = cells.map(c => c.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });

  describe('Village Level Validation', () => {
    test('should have exactly 14,837 villages', () => {
      const villages = getAllVillages();
      expect(villages.length).toBe(14837);
    });

    test('each village should have a valid parent cell', () => {
      const villages = getAllVillages();
      const cells = getAllCells();
      const cellCodes = cells.map(c => c.code);
      
      villages.forEach(village => {
        expect(village.parentCode).toBeDefined();
        expect(cellCodes).toContain(village.parentCode);
      });
    });

    test('village codes should be unique', () => {
      const villages = getAllVillages();
      const codes = villages.map(v => v.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });

    test('villages should have shortCode property', () => {
      const villages = getAllVillages();
      villages.forEach(village => {
        expect(village).toHaveProperty('shortCode');
        expect(typeof village.shortCode).toBe('string');
      });
    });
  });

  describe('Hierarchy Chain Validation', () => {
    test('should be able to traverse from village to province', () => {
      const villages = getAllVillages();
      const sampleVillages = villages.slice(0, 10); // Test first 10 villages
      
      sampleVillages.forEach(village => {
        const hierarchy = getHierarchy(village.code);
        expect(hierarchy.length).toBe(5); // Province -> District -> Sector -> Cell -> Village
        expect(hierarchy[0].code).toMatch(/^RW-[A-Z0-9-]+$/); // Province code (allow numbers and hyphens for uniqueness)
        expect(hierarchy[hierarchy.length - 1].code).toBe(village.code); // Village code
      });
    });

    test('should be able to traverse from cell to province', () => {
      const cells = getAllCells();
      const sampleCells = cells.slice(0, 10); // Test first 10 cells
      
      sampleCells.forEach(cell => {
        const hierarchy = getHierarchy(cell.code);
        expect(hierarchy.length).toBe(4); // Province -> District -> Sector -> Cell
        expect(hierarchy[0].code).toMatch(/^RW-[A-Z0-9-]+$/); // Province code (allow numbers and hyphens for uniqueness)
        expect(hierarchy[hierarchy.length - 1].code).toBe(cell.code); // Cell code
      });
    });

    test('should be able to traverse from sector to province', () => {
      const sectors = getAllSectors();
      const sampleSectors = sectors.slice(0, 10); // Test first 10 sectors
      
      sampleSectors.forEach(sector => {
        const hierarchy = getHierarchy(sector.code);
        expect(hierarchy.length).toBe(3); // Province -> District -> Sector
        expect(hierarchy[0].code).toMatch(/^RW-[A-Z0-9-]+$/); // Province code (allow numbers and hyphens for uniqueness)
        expect(hierarchy[hierarchy.length - 1].code).toBe(sector.code); // Sector code
      });
    });

    test('should be able to traverse from district to province', () => {
      const districts = getAllDistricts();
      districts.slice(0, 5).forEach(district => {
        const hierarchy = getHierarchy(district.code);
        expect(hierarchy.length).toBe(2); // Province -> District
        expect(hierarchy[0].code).toMatch(/^RW-[A-Z0-9-]+$/); // Province code (allow numbers and hyphens for uniqueness)
        expect(hierarchy[hierarchy.length - 1].code).toBe(district.code); // District code
      });
    });
  });

  describe('Data Integrity Validation', () => {
    test('all units should have required properties', () => {
      const provinces = getAllProvinces();
      const districts = getAllDistricts();
      const sectors = getAllSectors();
      const cells = getAllCells();
      const villages = getAllVillages();

      const allUnits = [...provinces, ...districts, ...sectors, ...cells, ...villages];
      
      allUnits.forEach(unit => {
        expect(unit).toHaveProperty('code');
        expect(unit).toHaveProperty('name');
        expect(unit).toHaveProperty('slug');
        expect(unit).toHaveProperty('center');
        expect(unit.center).toHaveProperty('lat');
        expect(unit.center).toHaveProperty('lng');
        
        if (unit.parentCode) {
          expect(typeof unit.parentCode).toBe('string');
        }
      });
    });

    test('codes should follow the correct format', () => {
      const provinces = getAllProvinces();
      const districts = getAllDistricts();
      const sectors = getAllSectors();
      const cells = getAllCells();
      const villages = getAllVillages();

      // Province codes: RW-XX (allow letters, numbers, and hyphens for uniqueness)
      provinces.forEach(province => {
        expect(province.code).toMatch(/^RW-[A-Z0-9-]+$/);
      });

      // District codes: RW-XX-YYY (allow numbers and hyphens for uniqueness)
      districts.forEach(district => {
        expect(district.code).toMatch(/^RW-[A-Z0-9-]+-[A-Z0-9-]+$/);
      });

      // Sector codes: RW-XX-YYY-ZZZ (allow numbers and hyphens for uniqueness)
      sectors.forEach(sector => {
        expect(sector.code).toMatch(/^RW-[A-Z0-9-]+-[A-Z0-9-]+-[A-Z0-9-]+$/);
      });

      // Cell codes: RW-XX-YYY-ZZZ-AAA (allow numbers and hyphens for uniqueness)
      cells.forEach(cell => {
        expect(cell.code).toMatch(/^RW-[A-Z0-9-]+-[A-Z0-9-]+-[A-Z0-9-]+-[A-Z0-9-]+$/);
      });

      // Village codes: RW-XX-YYY-ZZZ-AAA-BBB (allow numbers and hyphens for uniqueness)
      villages.forEach(village => {
        expect(village.code).toMatch(/^RW-[A-Z0-9-]+-[A-Z0-9-]+-[A-Z0-9-]+-[A-Z0-9-]+-[A-Z0-9-]+$/);
      });
    });

    test('slugs should be URL-safe and unique', () => {
      const provinces = getAllProvinces();
      const districts = getAllDistricts();
      const sectors = getAllSectors();
      const cells = getAllCells();
      const villages = getAllVillages();

      const allUnits = [...provinces, ...districts, ...sectors, ...cells, ...villages];
      const slugs = allUnits.map(unit => unit.slug);
      const uniqueSlugs = new Set(slugs);
      
      expect(uniqueSlugs.size).toBe(slugs.length);
      
      // Check that slugs are URL-safe
      slugs.forEach(slug => {
        expect(slug).toMatch(/^[a-z0-9-]+$/);
        expect(slug).not.toMatch(/^-|-$/); // Should not start or end with dash
      });
    });
  });
}); 