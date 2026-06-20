#!/usr/bin/env bun

const args = Bun.argv.slice(2)
const name = args[0] ?? "world"

console.log(`Hello, ${name}!`)
