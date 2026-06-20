import pkg from "../package.json" with { type: "json" }
import { main } from "./cli"

const defaultProgramInfo = {
  name: "grit",
  description: "A simple CLI tool built with Bun",
  version: "0.1.0",
}

const programInfo = {
  name: pkg.name || defaultProgramInfo.name,
  description: pkg.description || defaultProgramInfo.description,
  version: pkg.version || defaultProgramInfo.version,
}

main({ ...programInfo }).catch((error) => {
  console.error("An error occurred:", error)
  process.exit(1)
})
