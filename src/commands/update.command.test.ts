import { describe, expect, it, spyOn } from "bun:test"
import { UpdateService } from "../services/update.service"
import { UpdateCommand } from "./update.command"

describe("UpdateCommand", () => {
  it("updates the stable channel by default", async () => {
    let installedPackage = ""
    const service = new UpdateService(async (packageSpec) => {
      installedPackage = packageSpec
      return 0
    })
    const output = spyOn(console, "log").mockImplementation(() => {})

    try {
      await new UpdateCommand(service).build().parseAsync(["node", "grit"])

      expect(installedPackage).toBe("@johnpiapian/grit@latest")
      expect(output).toHaveBeenCalledWith("Updated @johnpiapian/grit@latest.")
    } finally {
      output.mockRestore()
    }
  })

  it("updates the requested alpha channel", async () => {
    let installedPackage = ""
    const service = new UpdateService(async (packageSpec) => {
      installedPackage = packageSpec
      return 0
    })

    await new UpdateCommand(service)
      .build()
      .parseAsync(["node", "grit", "--channel", "alpha"])

    expect(installedPackage).toBe("@johnpiapian/grit@alpha")
  })
})
