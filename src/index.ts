#!/usr/bin/env bun

export const buildGreeting = (name = "world") => `Hello, ${name}!`

if (import.meta.main) {
  const name = Bun.argv[2] ?? "world"
  console.log(buildGreeting(name))
}
