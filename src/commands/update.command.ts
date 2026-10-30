import { Command, Option } from "commander"
import { CLI_COMMAND_CATALOG } from "../command-catalog"
import { BaseCliCommand } from "../core/command.base"
import { UpdateService } from "../services/update.service"

const PACKAGE_NAME = "@johnpiapian/grit"
const UPDATE_COMMAND = CLI_COMMAND_CATALOG[1]

export class UpdateCommand extends BaseCliCommand {
  readonly id = UPDATE_COMMAND.id
  readonly description = UPDATE_COMMAND.description

  constructor(private readonly updateService = new UpdateService()) {
    super()
  }

  build(): Command {
    return new Command(this.id)
      .description(this.description)
      .addOption(
        new Option(
          UPDATE_COMMAND.options[0].flags,
          UPDATE_COMMAND.options[0].description,
        )
          .choices([...UPDATE_COMMAND.options[0].choices])
          .default(UPDATE_COMMAND.options[0].defaultValue),
      )
      .action(
        async ({
          channel,
        }: {
          channel: (typeof UPDATE_COMMAND.options)[0]["choices"][number]
        }) => {
          const response = await this.updateService.update(
            `${PACKAGE_NAME}@${channel}`,
          )
          response.print()
        },
      )
  }
}
