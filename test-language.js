const { getAllProvinces } = require('./dist/index.js');

console.log('Testing language functionality...\n');

// Test English (default)
console.log('🇺🇸 English provinces (default):');
const englishProvinces = getAllProvinces({ language: 'en' });
englishProvinces.forEach(province => {
  console.log(`  - ${province.name} (${province.code})`);
});

console.log('\n🇷🇼 Kinyarwanda provinces:');
const kinyarwandaProvinces = getAllProvinces({ language: 'rw' });
kinyarwandaProvinces.forEach(province => {
  console.log(`  - ${province.name} (${province.code})`);
});

console.log('\n✅ Language test complete!'); 