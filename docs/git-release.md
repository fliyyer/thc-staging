# Git Commit and Release Version Rules

This project uses Conventional Commits and Semantic Versioning to keep history readable and releases predictable.

## Commit Message Format

Use this format:

```txt
<type>(optional-scope): <short summary>
```

Examples:

```txt
feat(auth): add login form
fix(button): restore disabled cursor state
docs: add release rules
chore(deps): install zod and tanstack query
```

## Commit Types

- `feat`: Adds a new user-facing feature.
- `fix`: Fixes a bug or broken behavior.
- `docs`: Changes documentation only.
- `style`: Changes formatting without changing behavior.
- `refactor`: Changes code structure without adding features or fixing bugs.
- `perf`: Improves performance.
- `test`: Adds or updates tests.
- `build`: Changes build tooling, dependencies, or package config.
- `ci`: Changes CI/CD configuration.
- `chore`: Maintenance work that does not affect app behavior.
- `revert`: Reverts a previous commit.

## Commit Rules

- Use lowercase `type`.
- Keep the summary short, specific, and imperative.
- Do not end the summary with a period.
- Prefer one logical change per commit.
- Use a scope when it makes the affected area clearer, such as `ui`, `docs`, `deps`, `auth`, or `layout`.
- Run `npm run lint` before committing code changes.
- Run `npm run build` before merging or releasing.

## Branch Naming

Use short branch names grouped by purpose:

```txt
feature/<short-name>
fix/<short-name>
docs/<short-name>
chore/<short-name>
release/<version>
```

Examples:

```txt
feature/collab-dashboard
fix/button-cursor
docs/git-release-rules
release/1.0.0
```

## Versioning

Use Semantic Versioning:

```txt
MAJOR.MINOR.PATCH
```

- `MAJOR`: Breaking changes.
- `MINOR`: Backward-compatible features.
- `PATCH`: Backward-compatible bug fixes.

Examples:

- `1.0.0`: First stable release.
- `1.1.0`: Adds a new feature without breaking existing behavior.
- `1.1.1`: Fixes a bug.
- `2.0.0`: Introduces breaking changes.

## Pre-release Versions

Use pre-release identifiers when a release is not stable yet:

```txt
1.0.0-alpha.1
1.0.0-beta.1
1.0.0-rc.1
```

- `alpha`: Early testing.
- `beta`: Feature-complete testing.
- `rc`: Release candidate.

## Release Checklist

Before creating a release:

1. Confirm the working tree is clean.
2. Run `npm install` if dependencies changed.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Update `package.json` version.
6. Update release notes or changelog if available.
7. Commit with `chore(release): v<version>`.
8. Create a Git tag with `v<version>`.

Example:

```bash
npm version patch
git push
git push --tags
```

For a manual release commit:

```bash
git add package.json package-lock.json
git commit -m "chore(release): v1.0.1"
git tag v1.0.1
git push
git push origin v1.0.1
```

## Tag Rules

- Tags must use the `v<version>` format.
- Stable release tag example: `v1.0.0`.
- Pre-release tag example: `v1.0.0-beta.1`.
- Do not move or rewrite published release tags.

## Release Notes

Group release notes by change type:

```txt
## v1.1.0

### Features
- Add collaboration dashboard.

### Fixes
- Fix disabled button cursor.

### Documentation
- Add Git commit and release version rules.
```
