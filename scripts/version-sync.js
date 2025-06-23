#!/usr/bin/env node

/**
 * Improved Version Sync Script
 *
 * Ensures all versions (local, npm, git tag) are truly aligned.
 * - Always fetches latest tags from remote
 * - Compares latest tag commit with HEAD
 * - Warns if HEAD is behind or ahead
 * - Offers to create or update tags as needed
 * - Clear output and next steps
 */

const fs = require('fs');
const { 
  runGitCommand, 
  getLatestRemoteTag, 
  getTagCommit, 
  getHeadCommit,
  logSection, 
  logSuccess, 
  logError, 
  logWarning 
} = require('./utils');

function getLocalVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
  } catch (error) {
    logError(`Error reading package.json: ${error.message}`);
    return null;
  }
}

function getNpmVersion() {
  return runGitCommand('npm view rwanda-geo version');
}

function getTagVersion(tag) {
  return tag ? tag.replace(/^v/, '') : null;
}

function updateLocalVersion(newVersion) {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
    logSuccess(`Updated local version to ${newVersion}`);
    return true;
  } catch (error) {
    logError(`Error updating package.json: ${error.message}`);
    return false;
  }
}

function createGitTag(version) {
  try {
    runGitCommand(`git tag v${version}`);
    logSuccess(`Created git tag v${version}`);
    return true;
  } catch (error) {
    logError(`Error creating git tag: ${error.message}`);
    return false;
  }
}

function pushGitTag(version) {
  try {
    runGitCommand(`git push origin v${version}`);
    logSuccess(`Pushed git tag v${version}`);
    return true;
  } catch (error) {
    logError(`Error pushing git tag: ${error.message}`);
    return false;
  }
}

function main() {
  logSection('Improved Version Sync Check');

  // Always fetch tags from remote
  runGitCommand('git fetch --tags --force');

  const localVersion = getLocalVersion();
  const npmVersion = getNpmVersion();
  const latestTag = getLatestRemoteTag();
  const latestTagVersion = getTagVersion(latestTag);
  const latestTagCommit = getTagCommit(latestTag);
  const headCommit = getHeadCommit();

  console.log('📊 Current Versions:');
  console.log(`   Local (package.json):    ${localVersion || '❌ Error'}`);
  console.log(`   NPM Registry:            ${npmVersion || '❌ Error'}`);
  console.log(`   Latest Git Tag:          ${latestTag || 'none'} (${latestTagVersion || 'none'})`);
  console.log(`   Tag Commit:              ${latestTagCommit || 'none'}`);
  console.log(`   HEAD Commit:             ${headCommit || 'none'}`);
  console.log('');

  if (!localVersion || !npmVersion) {
    logError('Cannot proceed due to errors reading versions');
    process.exit(1);
  }

  // Check if all versions are the same
  if (localVersion === npmVersion && localVersion === latestTagVersion && latestTagCommit === headCommit) {
    logSuccess('All versions and git tags are in sync!');
    return;
  }

  // If HEAD is not at the latest tag, warn user
  if (latestTagCommit && headCommit && latestTagCommit !== headCommit) {
    logWarning('HEAD is not at the latest tag commit!');
    console.log(`   Latest tag (${latestTag}) is at commit ${latestTagCommit}`);
    console.log(`   Your HEAD is at commit ${headCommit}`);
    console.log('');
    console.log('💡 If you want to tag the current HEAD, run:');
    console.log(`   git tag v${localVersion}`);
    console.log(`   git push origin v${localVersion}`);
    return;
  }

  // If local version or npm version is higher than the latest tag, offer to tag
  const versions = [localVersion, npmVersion, latestTagVersion].filter(Boolean);
  const highestVersion = versions.reduce((highest, current) => {
    return current > highest ? current : highest;
  });

  if (localVersion !== highestVersion) {
    console.log(`📝 Local version (${localVersion}) is not the highest. Updating to ${highestVersion}...`);
    updateLocalVersion(highestVersion);
  }

  if (latestTagVersion !== highestVersion) {
    console.log(`🏷️  Latest git tag (${latestTagVersion}) is not the highest. Creating tag v${highestVersion}...`);
    createGitTag(highestVersion);
    pushGitTag(highestVersion);
  }

  if (npmVersion !== highestVersion) {
    logWarning(`NPM registry version (${npmVersion}) is not the highest. You may need to publish.`);
    console.log('   To publish, run: npm publish');
  }

  logSuccess('Version sync completed. All versions should now be aligned!');
}

main(); 