import { describe, expect, it } from "bun:test"
import { GreetingService } from "./greeting.service"

describe("GreetingService", () => {
  const service = new GreetingService()

  it("builds casual greetings with optional formatting", () => {
    expect(
      service.buildGreeting({
        name: "Ada",
        style: "casual",
        emoji: true,
        loud: true,
      }),
    ).toBe("👋 HEY ADA!")
  })

  it("uses the requested language", () => {
    expect(
      service.buildGreeting({
        name: "Ada",
        style: "formal",
        language: "fr",
      }),
    ).toBe("Bonjour, Ada!")
  })

  it("selects a time-based greeting from the supplied date", () => {
    expect(
      service.buildGreeting({
        name: "Ada",
        style: "time",
        now: new Date(2026, 0, 1, 15),
      }),
    ).toBe("Good afternoon, Ada!")
  })
})
