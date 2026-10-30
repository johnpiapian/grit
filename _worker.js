export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === "/api/commands") {
      const { getWebCommandCatalog } = await import("./src/web.ts")
      return Response.json(getWebCommandCatalog())
    }

    if (url.pathname === "/api/greet") {
      const body = await request.json().catch(() => ({}))
      const { buildWebGreetingResponse, normalizeGreetingRequest } =
        await import("./src/web.ts")
      const payload = normalizeGreetingRequest(body)

      return Response.json(buildWebGreetingResponse(payload))
    }

    return new Response("Not found", { status: 404 })
  },
}
