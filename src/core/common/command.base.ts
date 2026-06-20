import type { Command } from "commander"

export type CommandContext = {
  enabledCommands?: string[]
}

export abstract class BaseCliCommand {
  abstract readonly id: string
  abstract readonly description: string

  abstract build(): Command

  isEnabled(context: CommandContext): boolean {
    if (!context.enabledCommands || context.enabledCommands.length === 0) {
      return true
    }

    return context.enabledCommands.includes(this.id)
  }
}
