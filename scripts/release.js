#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

const versionType = process.argv[2];

if (!versionType || !['patch', 'minor', 'major'].includes(versionType)) {
  console.error('Usage: node scripts/release.js <patch|minor|major>');
  console.error('Example: node scripts/release.js patch');
  process.exit(1);
}

console.log(`🚀 Starting release process for ${versionType} version...`);

try {
  // Check if working directory is clean
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.error('❌ Working directory is not clean. Please commit or stash your changes first.');
    process.exit(1);
  }

  // Run tests
  console.log('🧪 Running tests...');
  execSync('npm test', { stdio: 'inherit' });

  // Build package
  console.log('🔨 Building package...');
  execSync('npm run build:all', { stdio: 'inherit' });

  // Bump version
  console.log(`📦 Bumping ${versionType} version...`);
  execSync(`npm version ${versionType}`, { stdio: 'inherit' });

  // Get new version
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const newVersion = packageJson.version;

  console.log(`✅ Version bumped to ${newVersion}`);

  // Push changes
  console.log('📤 Pushing changes to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });
  execSync(`git push origin v${newVersion}`, { stdio: 'inherit' });

  console.log(`🎉 Release ${newVersion} is ready!`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Create a GitHub release at: https://github.com/monehin/rwanda-geo/releases/new');
  console.log(`2. Use tag: v${newVersion}`);
  console.log(`3. Title: Release ${newVersion}`);
  console.log('4. The GitHub Action will automatically publish to npm when you publish the release.');

} catch (error) {
  console.error('❌ Release failed:', error.message);
  process.exit(1);
} 