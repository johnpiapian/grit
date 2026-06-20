import { describe, expect, it } from "bun:test"

import { buildGreeting } from "./index"

describe("buildGreeting", () => {
  it("defaults to world", () => {
    expect(buildGreeting()).toBe("Hello, world!")
  })

  it("uses provided name", () => {
    expect(buildGreeting("John")).toBe("Hello, John!")
  })
})
