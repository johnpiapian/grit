import { Command } from "commander"
import { CLI_COMMAND_CATALOG } from "../command-catalog"
import { BaseCliCommand } from "../core/command.base"
import { Response } from "../core/response.model"
import {
  buildGreetingMessage,
  type GreetingStyle,
  type GreetOptions,
  SUPPORTED_LANGUAGES,
  SUPPORTED_STYLES,
} from "../services/greeting.service"

export class GreetCommand extends BaseCliCommand {
  private readonly definition = CLI_COMMAND_CATALOG[0]
  readonly id = this.definition.id
  readonly description = this.definition.description

  // using it indirectly to allow exclusion of certain styles/languages
  private readonly supportedStyles = SUPPORTED_STYLES
  private readonly supportedLanguages = SUPPORTED_LANGUAGES

  build(): Command {
    const greetCommand = new Command(this.id)
      .description(this.description)
      .argument(
        this.definition.arguments[0].syntax,
        this.definition.arguments[0].description,
      )
      .argument(
        this.definition.arguments[1].syntax,
        this.definition.arguments[1].description,
        this.definition.arguments[1].defaultValue,
      )

    for (const option of this.definition.options) {
      greetCommand.option(
        option.flags,
        option.description,
        "defaultValue" in option ? option.defaultValue : undefined,
      )
    }

    return greetCommand.action((style, name, options) => {
      const validation = this.validateInput(name, style, options)
      if (validation.isError) {
        validation.print()
        return
      }

      const response = this.processGreeting(name, style, options)
      response.print()
    })
  }

  private validateInput(
    name: string,
    style: GreetingStyle,
    options: GreetOptions,
  ): Response {
    if (!name.trim()) {
      return Response.invalidArguments("Name cannot be empty.")
    }

    if (!this.supportedStyles.includes(style)) {
      return Response.invalidArguments(
        `Invalid style '${style}'. Supported styles are: ${this.supportedStyles.join(", ")}`,
      )
    }

    if (
      options.language &&
      !this.supportedLanguages.includes(options.language)
    ) {
      return Response.invalidArguments(
        `Unsupported language '${options.language}'. Supported languages are: ${this.supportedLanguages.join(", ")}`,
      )
    }

    return Response.success()
  }

  private processGreeting(
    name: string,
    style: GreetingStyle,
    options: GreetOptions,
  ): Response<string> {
    const message = buildGreetingMessage({
      name,
      style,
      loud: options.loud,
      emoji: options.emoji,
      language: options.language,
    })

    return Response.success(message)
  }
}
