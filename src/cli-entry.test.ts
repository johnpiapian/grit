import { describe, expect, it, spyOn } from "bun:test"
import { Command } from "commander"
import { buildProgram, main } from "./cli"
import { BaseCliCommand } from "./core/command.base"
import { Response, StatusCode } from "./core/response.model"

const programInfo = {
  name: "grit",
  description: "Test CLI",
  version: "1.0.0",
}

describe("main function", () => {
  it("registers the default command", () => {
    const program = buildProgram(programInfo, { env: {} })

    expect(program.commands.map((command) => command.name())).toEqual([
      "greet",
      "update",
    ])
  })

  it("filters commands using the injected environment", () => {
    const program = buildProgram(programInfo, {
      env: { GRIT_COMMANDS: "missing" },
    })

    expect(program.commands).toHaveLength(0)
  })

  it("waits for asynchronous command actions", async () => {
    let completed = false

    class AsyncTestCommand extends BaseCliCommand {
      readonly id = "async-test"
      readonly description = "Test asynchronous command execution"

      build(): Command {
        return new Command(this.id).action(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0))
          completed = true
        })
      }
    }

    await main(programInfo, {
      argv: ["node", "grit", "async-test"],
      commands: [new AsyncTestCommand()],
      env: {},
    })

    expect(completed).toBe(true)
  })
})

describe("Response", () => {
  it("sets a failing process exit code when printing an error", () => {
    const previousExitCode = process.exitCode
    const errorOutput = spyOn(console, "error").mockImplementation(() => {})

    try {
      Response.invalidArguments("Invalid input").print()
      expect(process.exitCode).toBe(StatusCode.INVALID_ARGUMENTS)
    } finally {
      process.exitCode = previousExitCode ?? 0 // Restore or reset to 0
      errorOutput.mockRestore()
    }
  })
})
