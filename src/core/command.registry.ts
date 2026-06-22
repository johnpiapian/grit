import type { Command } from "commander"
import type { BaseCliCommand, CommandContext } from "../core/command.base"

export class CommandRegistry {
  private commands: BaseCliCommand[] = []

  constructor(initialCommands?: BaseCliCommand[]) {
    if (initialCommands) {
      this.commands.push(...initialCommands)
    }
  }

  addCommands(command: BaseCliCommand): void
  addCommands(commands: BaseCliCommand[]): void
  addCommands(commandOrCommands: BaseCliCommand | BaseCliCommand[]): void {
    if (Array.isArray(commandOrCommands)) {
      this.commands.push(...commandOrCommands)
    } else {
      this.commands.push(commandOrCommands)
    }
  }

  register(program: Command, context: CommandContext): void {
    for (const command of this.commands) {
      if (command.isEnabled(context)) {
        program.addCommand(command.build())
      }
    }
  }
}
