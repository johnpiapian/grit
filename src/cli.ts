import { Command } from "commander"
import { GreetCommand } from "./commands/greet.command"
import { UpdateCommand } from "./commands/update.command"
import { loadAppConfig } from "./configs/app.config"
import type { BaseCliCommand } from "./core/command.base"
import { CommandRegistry } from "./core/command.registry"

export type MainParams = {
  name: string
  description: string
  version: string
}

export type MainOptions = {
  argv?: string[]
  env?: Record<string, string | undefined>
  commands?: BaseCliCommand[]
}

export function buildProgram(
  params: MainParams,
  options: Pick<MainOptions, "env" | "commands"> = {},
): Command {
  const appConfig = loadAppConfig(options.env)
  const program = new Command()
  const registry = new CommandRegistry(
    options.commands ?? [new GreetCommand(), new UpdateCommand()],
  )

  program
    .name(params.name)
    .description(params.description)
    .version(params.version, "-v, --version")

  registry.register(program, {
    enabledCommands: appConfig.enabledCommands,
  })

  return program
}

export async function main(
  params: MainParams,
  options: MainOptions = {},
): Promise<void> {
  await buildProgram(params, options).parseAsync(options.argv ?? process.argv)
}
