import { Command, Option } from "commander"
import { BaseCliCommand } from "../core/command.base"
import { UpdateService } from "../services/update.service"

const PACKAGE_NAME = "@johnpiapian/grit"
const UPDATE_CHANNELS = ["latest", "alpha"] as const

export class UpdateCommand extends BaseCliCommand {
  readonly id = "update"
  readonly description = "Update Grit to the latest version"

  constructor(private readonly updateService = new UpdateService()) {
    super()
  }

  build(): Command {
    return new Command(this.id)
      .description(this.description)
      .addOption(
        new Option("--channel <channel>", "Release channel to install")
          .choices([...UPDATE_CHANNELS])
          .default("latest"),
      )
      .action(
        async ({ channel }: { channel: (typeof UPDATE_CHANNELS)[number] }) => {
          const response = await this.updateService.update(
            `${PACKAGE_NAME}@${channel}`,
          )
          response.print()
        },
      )
  }
}
