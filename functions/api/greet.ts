import {
  buildWebGreetingResponse,
  normalizeGreetingRequest,
} from "../../src/web"

export async function onRequestPost({ request }: { request: Request }): Promise<Response> {
  try {
    const contentType = request.headers.get("content-type") ?? ""
    const body = contentType.includes("application/json")
      ? await request.json().catch(() => ({}))
      : {}

    const response = buildWebGreetingResponse(
      normalizeGreetingRequest(body as Parameters<typeof normalizeGreetingRequest>[0]),
    )

    return Response.json(response)
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to build greeting response",
      },
      { status: 400 },
    )
  }
}

export async function onRequest({ request }: { request: Request }): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "Method not allowed" }, { status: 405 })
  }

  return onRequestPost({ request })
}
