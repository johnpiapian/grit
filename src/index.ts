#!/usr/bin/env bun
import pkg from "../package.json" with { type: "json" }
import { type MainParams, main } from "./cli"

const defaultProgramInfo = {
  name: "grit",
  description: "A simple CLI tool built with Bun",
  version: "0.1.0",
}

const programInfo: MainParams = {
  name: pkg.name || defaultProgramInfo.name,
  description: pkg.description || defaultProgramInfo.description,
  version: pkg.version || defaultProgramInfo.version,
}

main(programInfo).catch((error: unknown) => {
  console.error("An error occurred:", error)
  process.exitCode = 1 // allow graceful exit with a non-zero exit code
})
