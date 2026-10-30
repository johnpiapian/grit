import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_STYLES,
} from "./services/greeting.service"

export const CLI_COMMAND_CATALOG = [
  {
    id: "greet",
    description: "Greet someone with various styles and options",
    usage: "<style> [name]",
    webSupported: true,
    arguments: [
      {
        syntax: "<style>",
        description: `Greeting style (${SUPPORTED_STYLES.join(", ")})`,
      },
      {
        syntax: "[name]",
        description: "Name of the person to greet",
        defaultValue: "world",
      },
    ],
    options: [
      { flags: "-l, --loud", description: "Print greeting in uppercase" },
      { flags: "-e, --emoji", description: "Include emojis in the greeting" },
      {
        flags: "--lang, --language <lang>",
        description: `Language code for multilingual style (${SUPPORTED_LANGUAGES.filter((language) => language !== "default").join(", ")})`,
        defaultValue: "default",
      },
    ],
  },
  {
    id: "update",
    description: "Update Grit to the latest version",
    usage: "[--channel <latest|alpha>]",
    webSupported: false,
    options: [
      {
        flags: "--channel <channel>",
        description: "Release channel to install",
        choices: ["latest", "alpha"],
        defaultValue: "latest",
      },
    ],
  },
] as const
