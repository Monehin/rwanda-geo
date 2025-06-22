import {
  getAllProvinces,
  getAllDistricts,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getByCode,
  getHierarchy,
  getChildren,
  searchByName,
  searchBySlug,
  getByLevel,
  getCounts,
  isValidCode,
  getCodeLevel,
  getSummary,
} from './helpers';

describe('rwanda-geo helpers', () => {
  test('getAllProvinces returns all provinces', () => {
    const result = getAllProvinces();
    expect(result.length).toBe(5);
    expect(result[0]).toHaveProperty('code');
    expect(result[0]).toHaveProperty('name');
  });

  test('getDistrictsByProvince returns correct districts', () => {
    const provinces = getAllProvinces();
    const provinceCode = provinces[0].code;
    const result = getDistrictsByProvince(provinceCode);
    expect(result.length).toBeGreaterThan(0);
    result.forEach(d => expect(d.parentCode).toBe(provinceCode));
  });

  test('getSectorsByDistrict returns correct sectors', () => {
    const districts = getAllDistricts();
    const districtCode = districts[0].code;
    const result = getSectorsByDistrict(districtCode);
    expect(result.length).toBeGreaterThan(0);
    result.forEach(s => expect(s.parentCode).toBe(districtCode));
  });

  test('getByCode returns the correct unit', () => {
    const districts = getAllDistricts();
    const code = districts[0].code;
    const unit = getByCode(code);
    expect(unit).toBeDefined();
    expect(unit?.code).toBe(code);
  });

  test('getByCode returns undefined for invalid code', () => {
    expect(getByCode('RW-XX-YYY')).toBeUndefined();
  });

  test('getHierarchy returns the correct parent chain', () => {
    const districts = getAllDistricts();
    const code = districts[0].code;
    const hierarchy = getHierarchy(code);
    expect(hierarchy.length).toBeGreaterThan(1);
    expect(hierarchy[0].code).toMatch(/^RW-[A-Z]+$/);
    expect(hierarchy[hierarchy.length - 1].code).toBe(code);
  });

  test('getChildren returns correct children', () => {
    const provinces = getAllProvinces();
    const parentCode = provinces[0].code;
    const children = getChildren(parentCode);
    expect(children.length).toBeGreaterThan(0);
    children.forEach(child => expect(child.parentCode).toBe(parentCode));
  });

  test('searchByName finds units by name', () => {
    const results = searchByName('Gasabo');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('gasabo');
  });

  test('searchBySlug finds units by slug', () => {
    const provinces = getAllProvinces();
    const searchTerm = provinces[0].name.toLowerCase().split(' ')[0];
    const results = searchBySlug(searchTerm);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toContain(searchTerm);
  });

  test('getByLevel returns correct units', () => {
    expect(getByLevel('province').length).toBe(5);
    expect(getByLevel('district').length).toBe(30);
    expect(getByLevel('sector').length).toBe(416);
    expect(getByLevel('cell').length).toBe(2148);
    expect(getByLevel('village').length).toBe(14837);
  });

  test('getCounts returns correct counts', () => {
    const counts = getCounts();
    expect(counts.provinces).toBe(5);
    expect(counts.districts).toBe(30);
    expect(counts.sectors).toBe(416);
    expect(counts.cells).toBe(2148);
    expect(counts.villages).toBe(14837);
    expect(counts.total).toBe(17436);
  });

  test('isValidCode validates codes correctly', () => {
    expect(isValidCode('RW-KG')).toBe(true);
    expect(isValidCode('RW-KG-GAS')).toBe(true);
    expect(isValidCode('RW-KG-GAS-BUM')).toBe(true);
    expect(isValidCode('RW-KG-GAS-BUM-BUM')).toBe(true);
    expect(isValidCode('RW-KG-GAS-BUM-BUM-BUM')).toBe(true);
    expect(isValidCode('RW-XX-YYY-ZZZ-AAA-BBB')).toBe(true);
    expect(isValidCode('INVALID')).toBe(false);
    expect(isValidCode('RW-KG-GAS-BUM-BUM-BUM-EXTRA')).toBe(false);
  });

  test('getCodeLevel returns correct level', () => {
    expect(getCodeLevel('RW-KG')).toBe('province');
    expect(getCodeLevel('RW-KG-GAS')).toBe('district');
    expect(getCodeLevel('RW-KG-GAS-BUM')).toBe('sector');
    expect(getCodeLevel('RW-KG-GAS-BUM-BUM')).toBe('cell');
    expect(getCodeLevel('RW-KG-GAS-BUM-BUM-BUM')).toBe('village');
    expect(getCodeLevel('INVALID')).toBeUndefined();
  });

  test('getSummary returns correct summary', () => {
    const summary = getSummary();
    expect(summary).toEqual({
      provinces: 5,
      districts: 30,
      sectors: 416,
      cells: 2148,
      villages: 14837,
    });
  });
}); 