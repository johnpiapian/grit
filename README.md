# grit

Basic Bun starter project for a CLI.

## Requirements

- [Bun](https://bun.sh)

## Getting started

```bash
bun install
bun run check
bun run start
```

## Tooling

```bash
bun run lint
bun run format:check
bun run typecheck
bun run test
```

## Build, dist, and package

```bash
bun run build
bun run package
```

`bun run build` writes a bundled CLI to `dist/index.js`, and `bun run package` creates a publishable tarball with the built output.

## Try the CLI

```bash
bun run src/index.ts
bun run src/index.ts John
```
