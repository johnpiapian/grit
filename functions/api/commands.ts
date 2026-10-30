import { getWebCommandCatalog } from "../../src/web"

export function onRequest({ request }: { request: Request }): Response {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 })
  }

  return Response.json(getWebCommandCatalog())
}
