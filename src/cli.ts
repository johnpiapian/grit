import { Command } from "commander"

type MainParams = {
  name: string
  description: string
  version: string
}

/**
 * @param params - The parameters for the main function, including optional name, description, and version.
 * @returns void
 * @description This function initializes a CLI program using the Commander library. It sets up a command 
 * called "greet" that takes an optional name argument and prints a greeting message to the console. 
 * The program is then parsed to handle user input.
 */
export async function main(params: MainParams) {
  const program = new Command()

  program
    .name(params.name)
    .description(params.description)
    .version(params.version, '-v, --version')

  program
    .command("greet [name]")
    .description("Greet a person by name")
    .action((name) => {
      console.log(`Hello, ${name ?? "world"}!`)
    })

  program.parse(process.argv)
}