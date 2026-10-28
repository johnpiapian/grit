# grit

`grit` is a Bun-first command-line application built around small, independently testable commands. The included `greet` command demonstrates argument validation, options, and service-backed behavior.

## Quick Start

Requirements: [Bun](https://bun.sh/) to install dependencies, run the project, and build it.

```bash
bun install
bun run src/index.ts greet casual Ada --emoji
```

Expected output:

```text
👋 Hey Ada!
```

## Commands

The `greet` command accepts a style (`formal`, `casual`, or `time`) and an optional name. The name defaults to `world`.

```bash
bun run src/index.ts greet formal Ada
bun run src/index.ts greet time Ada --loud
bun run src/index.ts greet casual Ada --lang fr --emoji
```

Options:

| Option | Description |
| --- | --- |
| `-l, --loud` | Print the greeting in uppercase. |
| `-e, --emoji` | Add a style-specific emoji. |
| `--lang, --language <lang>` | Select `es`, `fr`, `de`, `jp`, or `default`. |

## Configuration

Set `GRIT_COMMANDS` to a comma-separated list of enabled command IDs. If it is unset or empty, all registered commands are enabled.

```bash
GRIT_COMMANDS=greet bun run src/index.ts greet casual Ada
```

## Architecture

```text
src/
├── index.ts                 # Executable entry point and process-level errors
├── index.test.ts            # CLI composition and response tests
├── cli.ts                   # Commander setup, configuration, and command registration
├── commands/                # CLI command adapters, arguments, and validation
├── configs/                 # configuration and environment helpers
├── core/                    # Command contract, registry, and response model
├── utils/                   # Shared string and time helpers
└── services/
	├── greeting.service.ts       # Greeting behavior, independent of CLI parsing
	└── greeting.service.test.ts  # Greeting behavior tests
```

`index.ts` reads package metadata and calls `main`. `buildProgram` in `cli.ts` assembles configuration and command implementations; it accepts optional environment and command overrides. `main` accepts an optional argument list and parses it asynchronously, defaulting to the current process arguments. These inputs let tests exercise command composition and parsing without mutating process-global state. Each command builds its Commander interface and delegates domain work to a service; shared command and response behavior lives in `core/`.

## Add a Command

1. Add a class under `src/commands/` that extends `BaseCliCommand` and implements its `id`, `description`, and `build()` method.
2. Keep argument parsing and validation in the command. Put reusable domain behavior in a service under `src/services/`.
3. Register the command in the default command list in `src/cli.ts`.
4. Add behavior-focused tests next to the code they cover, using Bun's test runner.

Use `Response` for consistent output and error status handling. The `GRIT_COMMANDS` setting can then enable or filter registered commands by their IDs.

## Development

```bash
bun install
bun run dev
```

Run the full check suite before submitting changes:

```bash
bun run check
```

Individual checks are available with `bun test`, `bun run lint`, and `bun run typecheck`.
The GitHub Actions workflow runs the full check suite on pushes to `main` and on pull requests.

## Build and Package

```bash
bun run build
bun run build:standalone
```

`bun run build` creates `dist/index.js`, a bundled CLI that can run with Bun or Node. `bun run build:standalone` creates `dist/grit`, a platform-specific executable with the Bun runtime included.

To inspect or create the npm package:

```bash
bun pm pack --dry-run
bun pm pack
```

Packaging builds the CLI and exposes `dist/index.js` as the `grit` command. The standalone executable is not included in the npm package.

## Release

After merging a version update to `main`, push a matching version tag to publish the package and create a GitHub Release:

```bash
VERSION=$(node -p "require('./package.json').version")
git tag "v$VERSION"
git push origin "v$VERSION"
```

The workflow verifies that the tag matches `package.json`, publishes the package to GitHub Packages, and generates release notes. Versions with a prerelease suffix, such as `-alpha`, create prereleases.

<!-- The publish workflow extracts only the section between these markers. -->
<!-- package-readme:start -->
## Install

Requires [Bun](https://bun.sh/). Configure npm to use GitHub Packages for the `@johnpiapian` scope, then install the package:

Option 1: Configure the scope once, then install:

```bash
npm config set @johnpiapian:registry https://npm.pkg.github.com
npm install -g @johnpiapian/grit
```

Option 2: Set the registries for this install only:

```bash
npm --registry=https://registry.npmjs.org \
	--@johnpiapian:registry=https://npm.pkg.github.com \
	install -g @johnpiapian/grit
```

GitHub Packages may require authentication. See [GitHub's npm registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) for setup details.

## Usage

```bash
grit greet casual Ada --emoji
```
<!-- package-readme:end -->

## License

This project is distributed under the [ISC License](https://opensource.org/license/isc-license-txt/).