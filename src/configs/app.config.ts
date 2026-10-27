import { parseCSVList } from "../utils/strings"

export type AppConfig = {
  enabledCommands?: string[] // If undefined, all commands are enabled
}

export function loadAppConfig(
  env: Record<string, string | undefined> = process.env,
): AppConfig {
  const enabledCommands = parseCSVList(env.GRIT_COMMANDS)

  return {
    enabledCommands: enabledCommands.length > 0 ? enabledCommands : undefined,
  }
}
