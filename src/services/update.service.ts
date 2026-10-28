import { spawn } from "node:child_process"
import { Response } from "../core/response.model"

export type NpmInstallRunner = (packageSpec: string) => Promise<number>

export class UpdateService {
  constructor(
    private readonly installGlobally: NpmInstallRunner = installPackageGlobally,
  ) {}

  async update(packageSpec: string): Promise<Response> {
    try {
      const exitCode = await this.installGlobally(packageSpec)
      if (exitCode !== 0) {
        return Response.error(`npm install failed with exit code ${exitCode}.`)
      }

      return Response.success(`Updated ${packageSpec}.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return Response.error(
        `Could not run npm to update the package: ${message}`,
      )
    }
  }
}

function installPackageGlobally(packageSpec: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32"
    const npm = isWindows ? "npm.cmd" : "npm"
    const child = spawn(npm, ["install", "--global", packageSpec], {
      shell: isWindows,
      stdio: "inherit",
    })

    child.once("error", reject)
    child.once("close", (code) => resolve(code ?? 1))
  })
}
