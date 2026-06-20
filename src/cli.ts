import { Command } from "commander"
import { loadAppConfig } from "./configs/app.config"
import { CommandRegistry } from "./core/common/command.registry"

import { GreetCommand } from "./commands/greet.command"

type MainParams = {
  name: string
  description: string
  version: string
}

export async function main(params: MainParams) {
  const appConfig = loadAppConfig()
  const program = new Command()
  const registry = new CommandRegistry()

  program
    .name(params.name)
    .description(params.description)
    .version(params.version, "-v, --version")

  registry.addCommands(new GreetCommand())
  registry.register(program, {
    enabledCommands: appConfig.enabledCommands,
  })

  program.parse(process.argv)
}