# Version Management Guide

## 🔍 **Understanding Version Sync**

Your package has **3 places** where versions are stored:

1. **Local (`package.json`)** - Your current working version
2. **NPM Registry** - The published version on npm
3. **Git Tags** - Version tags in your git repository

## 🛠️ **Quick Commands**

### Check Current Versions
```bash
npm run version:check
```

### Sync All Versions
```bash
npm run version:sync
```

## 📊 **What the Script Does**

### `npm run version:check`
- Shows all three versions
- Identifies mismatches
- Suggests what to do

### `npm run version:sync`
- Finds the highest version among all three
- Updates local `package.json` if needed
- Creates git tags if needed
- Pushes tags to remote

## 🔄 **Common Scenarios**

### Scenario 1: NPM is ahead
```
Local: 1.0.13
NPM:   1.0.14  ← Highest
Git:   1.0.12
```
**Solution:** Run `npm run version:sync` to update local and git to 1.0.14

### Scenario 2: Local is ahead
```
Local: 1.0.15  ← Highest
NPM:   1.0.14
Git:   1.0.14
```
**Solution:** Run `npm run version:sync` to update git to 1.0.15

### Scenario 3: All in sync
```
Local: 1.0.14
NPM:   1.0.14
Git:   1.0.14
```
**Result:** ✅ All versions are in sync!

## 🚀 **Workflow Integration**

### Before Publishing
```bash
npm run version:check
```

### After Workflow Issues
```bash
npm run version:sync
git add package.json
git commit -m "Sync version to X.X.X"
git push origin main
```

## ⚠️ **Important Notes**

- **Never manually edit versions** - Let the workflow handle it
- **Always check before publishing** - Use `npm run version:check`
- **Sync after workflow issues** - If workflows fail, sync versions
- **Commit after syncing** - Always commit the updated package.json

## 🎯 **Best Practices**

1. **Check before pushing** - Run `npm run version:check` before pushing to main
2. **Sync after issues** - If workflows fail, sync versions first
3. **Let workflows handle bumps** - Don't manually bump versions
4. **Keep git tags current** - Always have git tags matching npm versions 