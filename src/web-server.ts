import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { buildWebGreetingResponse, normalizeGreetingRequest } from "./web"

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, "..")
const publicDir = join(__dirname, "../public")

function resolveStaticPath(pathname: string): string {
  const relativePath = pathname === "/" ? "/index.html" : pathname
  return join(publicDir, relativePath.replace(/^\/+/, ""))
}

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3000),
  fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === "/api/greet") {
      if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 })
      }

      try {
        const payload = (request.headers.get("Content-Type") ?? "").includes(
          "application/json",
        )
          ? (request.json() as Promise<Record<string, unknown>>)
          : Promise.resolve({})

        return payload.then((data) => {
          const normalized = normalizeGreetingRequest(
            data as Parameters<typeof normalizeGreetingRequest>[0],
          )
          return Response.json(buildWebGreetingResponse(normalized))
        })
      } catch (error) {
        return Response.json(
          {
            error:
              error instanceof Error ? error.message : "Invalid request body",
          },
          { status: 400 },
        )
      }
    }

    const filePath = resolveStaticPath(url.pathname)
    const file = Bun.file(filePath)

    return file.exists().then((exists) => {
      if (!exists) {
        return new Response("Not found", { status: 404 })
      }

      const extension = filePath.split(".").pop() ?? "txt"
      const map = {
        html: "text/html; charset=utf-8",
        css: "text/css; charset=utf-8",
        js: "application/javascript; charset=utf-8",
        json: "application/json; charset=utf-8",
      }

      return new Response(file, {
        headers: {
          "Content-Type":
            map[extension as keyof typeof map] ?? "text/plain; charset=utf-8",
        },
      })
    })
  },
})

console.log(`Grit web app running at http://localhost:${server.port}`)
