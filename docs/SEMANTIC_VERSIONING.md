# Semantic Versioning Guide

This document explains how semantic versioning works in the Rwanda-Geo project and how versions are automatically managed.

## Overview

Rwanda-Geo uses [Semantic Versioning 2.0.0](https://semver.org/) (SemVer) with automated version management through GitHub Actions. The version format is `MAJOR.MINOR.PATCH` (e.g., `1.0.17`).

## Version Components

- **MAJOR** (1.x.x): Breaking changes that require users to update their code
- **MINOR** (x.1.x): New features added in a backward-compatible manner
- **PATCH** (x.x.1): Bug fixes and backward-compatible improvements

## Commit Message Format

The automated versioning system analyzes commit messages to determine version bumps:

### Commit Types and Version Impact

| Commit Type | Version Bump | Example Commit Message |
|-------------|--------------|------------------------|
| `feat:` | MINOR (1.0.0 → 1.1.0) | `feat: add new search functionality` |
| `fix:` | PATCH (1.0.0 → 1.0.1) | `fix: resolve data loading issue` |
| `BREAKING CHANGE:` | MAJOR (1.0.0 → 2.0.0) | `feat: BREAKING CHANGE: restructure API` |
| `docs:`, `style:`, `refactor:`, `test:`, `chore:` | None | `docs: update README` |

### Commit Message Examples

```bash
# Minor version bump (1.0.17 → 1.1.0)
git commit -m "feat: add automated GitHub release creation"

# Patch version bump (1.0.17 → 1.0.18)
git commit -m "fix: restore old code format and fix test failures"

# Major version bump (1.0.17 → 2.0.0)
git commit -m "feat: BREAKING CHANGE: restructure API interface"

# No version bump
git commit -m "docs: update semantic versioning guide"
git commit -m "refactor: eliminate redundant logic across scripts"
git commit -m "test: add new test cases"
```

## Automated Workflow

### Auto-Publish Workflow (`.github/workflows/auto-publish.yml`)

This workflow automatically:
1. **Analyzes commit messages** to determine version changes
2. **Bumps version** according to semantic versioning rules
3. **Publishes to npm** if version doesn't already exist
4. **Creates GitHub release** with release notes
5. **Creates git tag** for the new version

### Manual Publish Workflow (`.github/workflows/manual-publish.yml`)

For manual releases:
1. **Creates a new release** on GitHub
2. **Publishes to npm** with the release version
3. **Creates git tag** for the release

## Version Synchronization

### Current Version Status

- **Local version**: Check `package.json` or run `npm version`
- **NPM version**: Run `npm view rwanda-geo version`
- **Git tags**: Run `git tag --list | tail -5`

### Sync Versions

Use the version sync script to check and align versions:

```bash
# Check current version status
npm run version:check

# Sync versions (if needed)
npm run version:sync
```

## Recent Version History

| Version | Date | Type | Trigger |
|---------|------|------|---------|
| 1.1.0 | Recent | Minor | `feat: add automated and manual GitHub release creation` |
| 1.0.17 | Recent | Patch | `fix: restore old code format and fix test failures` |
| 1.0.16 | Recent | Patch | Various fixes and improvements |

## Best Practices

### Writing Commit Messages

1. **Use conventional commit format**:
   ```bash
   type(scope): description
   
   [optional body]
   
   [optional footer]
   ```

2. **Choose the right type**:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for test changes
   - `chore:` for maintenance tasks

3. **Be descriptive** but concise

### Version Management

1. **Don't manually edit version numbers** in `package.json`
2. **Let the automated workflow handle versioning**
3. **Use semantic commit messages** to trigger appropriate version bumps
4. **Check version status** before pushing changes

### Release Process

1. **Push changes** with semantic commit messages
2. **Automated workflow** analyzes commits and bumps version
3. **NPM package** is published automatically
4. **GitHub release** is created with release notes
5. **Git tag** is created for the version

## Troubleshooting

### Version Mismatch

If local and npm versions don't match:

```bash
# Check all versions
npm run version:check

# Sync versions
npm run version:sync

# Or manually update local version
npm version 1.1.0
git push --tags
```

### Failed Releases

If automated release fails:

1. **Check GitHub Actions** for error details
2. **Verify npm credentials** are configured
3. **Check if version already exists** on npm
4. **Use manual release** if needed

### Manual Release

For manual releases:

1. **Create GitHub release** with desired version
2. **Workflow will publish to npm** automatically
3. **Git tag will be created** for the release

## Configuration

### Workflow Configuration

The automated workflows are configured in:
- `.github/workflows/auto-publish.yml` - Automatic releases
- `.github/workflows/manual-publish.yml` - Manual releases

### Version Scripts

Package.json includes version management scripts:
- `version:check` - Check version status
- `version:sync` - Sync versions across platforms

## References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [NPM Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish) 