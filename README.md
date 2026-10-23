# grit

A Bun-first CLI. Bun is required to develop, build, and run it, including when installed from npm.

## Develop

```bash
bun install
bun run check
bun run dev
```

Run a command directly:

```bash
bun run src/index.ts greet casual Ada
```

## Build

```bash
bun run build
bun run build:standalone
```

`bun run build` bundles the CLI as `dist/index.js`. It still needs Bun (or Node) to run.

`bun run build:standalone` creates `dist/grit`, a platform-specific executable with the Bun runtime included. It runs without a separate Bun installation.

## Package

```bash
bun pm pack --dry-run
bun pm pack
```

Packaging runs the build and exposes `dist/index.js` as the `grit` command. The npm package requires Bun (or Node) at runtime; the standalone executable is not included.