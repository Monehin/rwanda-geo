#!/usr/bin/env node

/**
 * Commit Helper Script
 * 
 * This script helps you write conventional commit messages that will
 * automatically trigger the correct version bump in the auto-publish workflow.
 * 
 * Usage:
 *   node scripts/commit-helper.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Rwanda Geo Commit Helper\n');
console.log('This helper will guide you to write conventional commit messages.');
console.log('The auto-publish workflow will use these to determine version bumps:\n');

console.log('📋 Version Bump Rules:');
console.log('• "BREAKING CHANGE:" or "major:" → Major version bump (1.0.0 → 2.0.0)');
console.log('• "feat:" or "feature:" → Minor version bump (1.0.0 → 1.1.0)');
console.log('• Everything else → Patch version bump (1.0.0 → 1.0.1)\n');

console.log('💡 Examples:');
console.log('• feat: add new search functionality');
console.log('• fix: resolve coordinate parsing issue');
console.log('• docs: update README with new examples');
console.log('• BREAKING CHANGE: remove deprecated API methods');
console.log('• major: completely refactor data structure\n');

rl.question('What type of change are you making? (feat/fix/docs/refactor/breaking): ', (type) => {
  rl.question('Brief description of your change: ', (description) => {
    rl.question('Detailed description (optional, press Enter to skip): ', (details) => {
      rl.question('Breaking changes (if any, press Enter to skip): ', (breaking) => {
        
        let commitMessage = '';
        
        // Handle breaking changes
        if (breaking && breaking.trim()) {
          commitMessage = `BREAKING CHANGE: ${description}\n\n${breaking}`;
        } else if (type.toLowerCase() === 'breaking' || type.toLowerCase() === 'major') {
          commitMessage = `major: ${description}`;
        } else if (type.toLowerCase() === 'feat' || type.toLowerCase() === 'feature') {
          commitMessage = `feat: ${description}`;
        } else {
          commitMessage = `${type}: ${description}`;
        }
        
        // Add details if provided
        if (details && details.trim()) {
          commitMessage += `\n\n${details}`;
        }
        
        console.log('\n📝 Your commit message:');
        console.log('─'.repeat(50));
        console.log(commitMessage);
        console.log('─'.repeat(50));
        
        console.log('\n✨ Copy this message for your git commit!');
        console.log('\n💡 Next steps:');
        console.log('1. git add .');
        console.log('2. git commit -m "your message here"');
        console.log('3. git push origin main');
        console.log('4. The auto-publish workflow will handle version bumping and npm publishing!');
        
        rl.close();
      });
    });
  });
}); 