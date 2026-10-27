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
├── cli.ts                   # Commander setup, configuration, and registration
├── commands/                # CLI command adapters, arguments, and validation
├── configs/                 # configuration and environment helpers
├── core/                    # Command contract, registry, and response model
├── services/                # Greeting behavior, independent of CLI parsing
└── utils/                   # Shared string and time helpers
```

`index.ts` reads package metadata and calls `main`. The CLI setup loads configuration and registers command implementations through `CommandRegistry`. Each command builds its Commander interface and delegates its domain work to a service; shared command and response behavior lives in `core/`.

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

## License

This project is distributed under the [ISC License](https://opensource.org/license/isc-license-txt/).