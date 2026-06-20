import { describe, expect, it } from "bun:test"
import { main } from "./cli"

describe("main function", () => {
  it("should be defined", () => {
    expect(main).toBeDefined()
  })

  it("should be a function", () => {
    expect(typeof main).toBe("function")
  })
})