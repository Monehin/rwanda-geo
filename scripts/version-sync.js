#!/usr/bin/env node

/**
 * Version Sync Script
 * 
 * This script helps you check and sync versions between:
 * - Local package.json
 * - NPM registry
 * - Git tags
 * 
 * Usage:
 *   node scripts/version-sync.js
 *   node scripts/version-sync.js --check
 *   node scripts/version-sync.js --sync
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Get command line arguments
const args = process.argv.slice(2);
const isCheckOnly = args.includes('--check');
const isSync = args.includes('--sync');

function getLocalVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    return null;
  }
}

function getNpmVersion() {
  try {
    const output = execSync('npm view rwanda-geo version', { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    console.error('❌ Error getting npm version:', error.message);
    return null;
  }
}

function getLatestGitTag() {
  try {
    const output = execSync('git describe --tags --abbrev=0 2>/dev/null || echo "none"', { encoding: 'utf8' });
    const tag = output.trim();
    return tag === 'none' ? null : tag.replace('v', '');
  } catch (error) {
    console.error('❌ Error getting git tag:', error.message);
    return null;
  }
}

function updateLocalVersion(newVersion) {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✅ Updated local version to ${newVersion}`);
    return true;
  } catch (error) {
    console.error('❌ Error updating package.json:', error.message);
    return false;
  }
}

function createGitTag(version) {
  try {
    execSync(`git tag v${version}`, { stdio: 'inherit' });
    console.log(`✅ Created git tag v${version}`);
    return true;
  } catch (error) {
    console.error('❌ Error creating git tag:', error.message);
    return false;
  }
}

function pushGitTag(version) {
  try {
    execSync(`git push origin v${version}`, { stdio: 'inherit' });
    console.log(`✅ Pushed git tag v${version}`);
    return true;
  } catch (error) {
    console.error('❌ Error pushing git tag:', error.message);
    return false;
  }
}

function main() {
  console.log('🔍 Version Sync Check\n');
  
  const localVersion = getLocalVersion();
  const npmVersion = getNpmVersion();
  const gitTagVersion = getLatestGitTag();
  
  console.log('📊 Current Versions:');
  console.log(`   Local (package.json):    ${localVersion || '❌ Error'}`);
  console.log(`   NPM Registry:            ${npmVersion || '❌ Error'}`);
  console.log(`   Latest Git Tag:          ${gitTagVersion || 'none'}`);
  console.log('');
  
  if (!localVersion || !npmVersion) {
    console.log('❌ Cannot proceed due to errors reading versions');
    process.exit(1);
  }
  
  const versions = [localVersion, npmVersion, gitTagVersion].filter(Boolean);
  const uniqueVersions = [...new Set(versions)];
  
  if (uniqueVersions.length === 1) {
    console.log('✅ All versions are in sync!');
    return;
  }
  
  console.log('⚠️  Version mismatch detected!');
  console.log('');
  
  // Find the highest version
  const highestVersion = versions.reduce((highest, current) => {
    return current > highest ? current : highest;
  });
  
  console.log(`📈 Highest version found: ${highestVersion}`);
  console.log('');
  
  if (isCheckOnly) {
    console.log('💡 To sync versions, run:');
    console.log('   node scripts/version-sync.js --sync');
    return;
  }
  
  if (isSync) {
    console.log('🔄 Syncing versions...\n');
    
    let success = true;
    
    // Update local version if needed
    if (localVersion !== highestVersion) {
      console.log(`📝 Updating local version from ${localVersion} to ${highestVersion}...`);
      success = updateLocalVersion(highestVersion) && success;
    }
    
    // Create git tag if needed
    if (gitTagVersion !== highestVersion) {
      console.log(`🏷️  Creating git tag for version ${highestVersion}...`);
      success = createGitTag(highestVersion) && success;
      
      if (success) {
        console.log(`📤 Pushing git tag...`);
        success = pushGitTag(highestVersion) && success;
      }
    }
    
    if (success) {
      console.log('\n✅ Version sync completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('   1. Commit the updated package.json: git add package.json && git commit -m "Sync version to ' + highestVersion + '"');
      console.log('   2. Push to main: git push origin main');
    } else {
      console.log('\n❌ Some sync operations failed. Please check the errors above.');
    }
  } else {
    console.log('💡 Available options:');
    console.log('   --check  : Only check versions (default)');
    console.log('   --sync   : Sync all versions to the highest one');
  }
}

main(); 