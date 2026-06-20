import { Command } from "commander"
import { GreetCommand } from "./commands/greet.command"
import { loadAppConfig } from "./configs/app.config"
import { CommandRegistry } from "./core/common/command.registry"

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
