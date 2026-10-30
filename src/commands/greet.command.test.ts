import { describe, expect, it, spyOn } from "bun:test"
import { StatusCode } from "../core/response.model"
import { GreetCommand } from "./greet.command"

describe("GreetCommand", () => {
  it("uses world when no name is provided", async () => {
    const previousExitCode = process.exitCode
    const output = spyOn(console, "log").mockImplementation(() => {})

    try {
      await new GreetCommand().build().parseAsync(["node", "grit", "casual"])

      expect(output).toHaveBeenCalledWith("Hey world!")
    } finally {
      process.exitCode = previousExitCode ?? 0
      output.mockRestore()
    }
  })

  it("applies loud, emoji, and language options", async () => {
    const previousExitCode = process.exitCode
    const output = spyOn(console, "log").mockImplementation(() => {})

    try {
      await new GreetCommand()
        .build()
        .parseAsync([
          "node",
          "grit",
          "casual",
          "Ada",
          "--loud",
          "--emoji",
          "--lang",
          "fr",
        ])

      expect(output).toHaveBeenCalledWith("👋 BONJOUR, ADA!")
    } finally {
      process.exitCode = previousExitCode ?? 0
      output.mockRestore()
    }
  })

  it("rejects unsupported styles", async () => {
    const previousExitCode = process.exitCode
    const errors = spyOn(console, "error").mockImplementation(() => {})

    try {
      await new GreetCommand()
        .build()
        .parseAsync(["node", "grit", "unknown", "Ada"])

      expect(errors).toHaveBeenCalledWith(
        "Error (2): Invalid style 'unknown'. Supported styles are: formal, casual, time",
      )
      expect(process.exitCode).toBe(StatusCode.INVALID_ARGUMENTS)
    } finally {
      process.exitCode = previousExitCode ?? 0
      errors.mockRestore()
    }
  })

  it("rejects unsupported languages", async () => {
    const previousExitCode = process.exitCode
    const errors = spyOn(console, "error").mockImplementation(() => {})

    try {
      await new GreetCommand()
        .build()
        .parseAsync(["node", "grit", "casual", "Ada", "--lang", "xx"])

      expect(errors).toHaveBeenCalledWith(
        "Error (2): Unsupported language 'xx'. Supported languages are: es, fr, de, jp, default",
      )
      expect(process.exitCode).toBe(StatusCode.INVALID_ARGUMENTS)
    } finally {
      process.exitCode = previousExitCode ?? 0
      errors.mockRestore()
    }
  })
})
