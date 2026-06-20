import { Command } from "commander"
import { BaseCliCommand } from "../core/common/command.base"
import { GreetingService } from "../core/greeting.service"
import { Response } from "../core/common/response.model"

import {
  SUPPORTED_STYLES,
  SUPPORTED_LANGUAGES,
  type GreetOptions,
  type GreetingStyle,
} from "../core/greeting.service"

export class GreetCommand extends BaseCliCommand {
  readonly id = "greet"
  readonly description = "Greet someone with various styles and options"

  // using it indirectly to allow exclusion of certain styles/languages
  private readonly supportedStyles = SUPPORTED_STYLES
  private readonly supportedLanguages = SUPPORTED_LANGUAGES

  private readonly greetingService = new GreetingService()

  build(): Command {
    const greetCommand = new Command(this.id)
      .description(this.description)
      .argument("<style>", `Greeting style (${this.supportedStyles.join(", ")})`)
      .argument("[name]", "Name of the person to greet", "world")
      .option("-l, --loud", "Print greeting in uppercase")
      .option("-e, --emoji", "Include emojis in the greeting")
      .option(
        "--lang, --language <lang>",
        "Language code for multilingual style (es, fr, de, jp)",
        "default",
      )
      .action((style, name, options) => {
        const validation = this.validateInput(name, style, options)
        if (validation.isError) {
          validation.print()
          return
        }

        const response = this.processGreeting(name, style, options)
        response.print()
      })

    return greetCommand
  }

  private validateInput(name: string, style: GreetingStyle, options: GreetOptions): Response {
    if (!name.trim()) {
      return Response.invalidArguments("Name cannot be empty.")
    }

    if (!this.supportedStyles.includes(style)) {
      return Response.invalidArguments(`Invalid style '${style}'. Supported styles are: ${this.supportedStyles.join(", ")}`)
    }

    if (options.language && !this.supportedLanguages.includes(options.language)) {
      return Response.invalidArguments(`Unsupported language '${options.language}'. Supported languages are: ${this.supportedLanguages.join(", ")}`)
    }

    return Response.success()
  }

  private processGreeting(name: string, style: GreetingStyle, options: GreetOptions): Response<string> {
    const message = this.greetingService.buildGreeting({
      name,
      style: style as any,
      loud: options.loud,
      emoji: options.emoji,
      language: options.language,
    })

    return Response.success(message)
  }
}