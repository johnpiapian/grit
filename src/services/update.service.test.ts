import { describe, expect, it } from "bun:test"
import { UpdateService } from "./update.service"

describe("UpdateService", () => {
  it("installs the requested package spec globally", async () => {
    let installedPackage = ""
    const service = new UpdateService(async (packageSpec) => {
      installedPackage = packageSpec
      return 0
    })

    const response = await service.update("@johnpiapian/grit@alpha")

    expect(installedPackage).toBe("@johnpiapian/grit@alpha")
    expect(response.isSuccess).toBe(true)
    expect(response.message).toBe("Updated @johnpiapian/grit@alpha.")
  })

  it("returns an error when npm exits unsuccessfully", async () => {
    const service = new UpdateService(async () => 1)

    const response = await service.update("@johnpiapian/grit@latest")

    expect(response.isError).toBe(true)
    expect(response.message).toBe("npm install failed with exit code 1.")
  })

  it("returns an error when npm cannot be started", async () => {
    const service = new UpdateService(async () => {
      throw new Error("npm not found")
    })

    const response = await service.update("@johnpiapian/grit@latest")

    expect(response.isError).toBe(true)
    expect(response.message).toContain("npm not found")
  })
})
