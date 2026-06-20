import { parseCsvList } from "../utils/strings"

export type AppConfig = {
  enabledCommands?: string[] // If undefined, all commands are enabled
}

export function loadAppConfig(): AppConfig {
  const enabledCommands = parseCsvList(process.env.GRIT_COMMANDS)

  return {
    enabledCommands: enabledCommands.length > 0 ? enabledCommands : undefined,
  }
}
