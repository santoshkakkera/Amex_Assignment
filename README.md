# Senior JavaScript Engineer Take-Home

## Overview

The implementation includes:

- Client-side response caching
- Request deduplication
- Server-side data preloading
- Cache serialization and hydration for SSR
- Zero additional network requests after hydration

---

## Running the Project

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
npm install
```

### Start the application

```bash
npm start
```

Open the application in your browser:

```
http://localhost:3000
```

Available routes:

- `/appWithoutSSRData` – Fetches data completely on the client.
- `/appWithSSRData` – Preloads data on the server and hydrates it on the client.

---

## Changes Made

### Caching Fetch Library

Implemented the following APIs:

- `useCachingFetch`
- `preloadCachingFetch`
- `serializeCache`
- `initializeCache`
- `wipeCache`

The implementation:

- Caches API responses in memory.
- Prevents duplicate network requests by sharing in-flight requests.
- Supports server-side data preloading.
- Serializes the server cache and restores it on the client.
- Prevents additional API requests after hydration.

### Version Control

- Initialized a Git repository.
- Added a root `.gitignore` for dependencies, build files, logs, environment files, and IDE files.

### TypeScript

- Added TypeScript as a development dependency.
- Added a `type-check` script using `tsc --noEmit`.
- Used a TypeScript version compatible with the current `typescript-eslint` release.

### ESLint

- Added ESLint using the latest flat configuration.
- Configured TypeScript, React, and React Hooks linting.

### Prettier

- Added Prettier configuration.
- Added a `.prettierignore` file for generated files and folders.

### Testing

- Added Vitest.
- Added a unit test covering cache serialization and initialization.

### Continuous Integration

- Added a GitHub Actions workflow to run:
  - Type checking
  - ESLint
  - Prettier format check
  - Unit tests

### Pre-Commit Hooks

- Added Husky and lint-staged.
- Configured pre-commit checks for type checking, linting, and formatting.

### Cleanup

- Removed the unused `.idea` folder to keep the project editor-independent.

---

## Future Improvements

Given more time, I would consider:

- Increasing unit and integration test coverage.
- Adding test coverage reporting in CI.
- Pinning the Node.js version using `.nvmrc` or the `engines` field.
- Configuring Dependabot or Renovate for dependency updates.
- Running CI against multiple Node.js versions.
- Adding Docker support.

---

## Available Scripts

| Script                 | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `npm start`            | Build and start the application.                   |
| `npm run build`        | Build the client and server bundles.               |
| `npm run type-check`   | Run TypeScript type checking.                      |
| `npm run lint`         | Run ESLint.                                        |
| `npm run lint:fix`     | Run ESLint and automatically fix supported issues. |
| `npm run format`       | Format the project using Prettier.                 |
| `npm run format:check` | Check formatting without modifying files.          |
| `npm test`             | Run the test suite.                                |
| `npm run test:watch`   | Run the test suite in watch mode.                  |
