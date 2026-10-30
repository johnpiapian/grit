const terminalScreen = document.querySelector("#terminal-screen")
const terminalInput = document.querySelector("#terminal-input")

const bootLines = [
  "Welcome to grit terminal.",
  "Type 'help' to see available commands.",
  "",
]

function appendLine(text, kind = "output") {
  const line = document.createElement("div")
  line.className = `terminal-line ${kind}`

  if (kind === "command") {
    const prompt = document.createElement("span")
    prompt.className = "prompt"
    prompt.textContent = "grit@web:~$"
    line.appendChild(prompt)
  }

  const content = document.createElement("span")
  content.textContent = text
  line.appendChild(content)

  terminalScreen.appendChild(line)
  terminalScreen.scrollTop = terminalScreen.scrollHeight
}

async function printHelp() {
  const response = await fetch("/api/commands")
  if (!response.ok) throw new Error("Could not load command help.")

  const commands = await response.json()
  appendLine("CLI commands:")

  for (const command of commands) {
    appendLine(`  ${command.id} ${command.usage}`)
    appendLine(
      `    ${command.description}${command.webSupported ? "" : " (CLI only)"}`,
    )

    for (const option of command.options) {
      appendLine(`    ${option.flags} - ${option.description}`)
    }
  }

  appendLine("Web controls: help, version, clear, ls, whoami")
}

function parseCommand(raw) {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const [command, ...args] = trimmed.split(/\s+/)
  return { command, args }
}

async function runGreetCommand(args) {
  const style = args[0] ?? "casual"
  const name = args[1] ?? "world"
  const flags = new Set(args.slice(2))

  const payload = {
    style,
    name,
    loud: flags.has("--loud"),
    emoji: flags.has("--emoji"),
    language: "default",
  }

  const langIndex = args.indexOf("--lang")
  if (langIndex !== -1) {
    payload.language = args[langIndex + 1] ?? "default"
  }

  const response = await fetch("/api/greet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    appendLine(data.error ?? "Could not generate a greeting.", "error")
    return
  }

  appendLine(data.greeting)
}

async function handleCommand(rawCommand) {
  const parsed = parseCommand(rawCommand)
  if (!parsed) return

  appendLine(rawCommand, "command")

  try {
    switch (parsed.command) {
      case "help":
        await printHelp()
        break
      case "version":
        appendLine("grit 2026.10.28")
        break
      case "clear":
        terminalScreen.innerHTML = ""
        break
      case "greet":
        await runGreetCommand(parsed.args)
        break
      case "ls":
        appendLine("src/  public/  README.md  package.json")
        break
      case "whoami":
        appendLine("guest")
        break
      default:
        appendLine(`Command not found: ${parsed.command}`, "error")
        appendLine("Type 'help' to see available commands.")
    }
  } catch (error) {
    appendLine(
      error instanceof Error ? error.message : "Unexpected error.",
      "error",
    )
  }

  terminalInput.value = ""
  terminalInput.focus()
}

bootLines.forEach((line) => {
  appendLine(line)
})
terminalInput.focus()

terminalInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleCommand(terminalInput.value)
  }
})
