import {
  buildGreetingMessage,
  normalizeGreetingInput,
  type GreetingStyle,
  type LanguageCode,
} from "./services/greeting.service"

export type GreetingRequest = {
  name: string
  style: GreetingStyle
  loud?: boolean
  emoji?: boolean
  language?: LanguageCode
}

export type WebGreetingResponse = {
  greeting: string
  ok: true
}

export function normalizeGreetingRequest(
  input: Partial<GreetingRequest> = {},
): GreetingRequest {
  const normalized = normalizeGreetingInput(input)

  return {
    name: normalized.name,
    style: normalized.style,
    loud: normalized.loud,
    emoji: normalized.emoji,
    language: normalized.language,
  }
}

export function buildWebGreetingResponse(
  input: Partial<GreetingRequest>,
): WebGreetingResponse {
  const request = normalizeGreetingRequest(input)

  return {
    greeting: buildGreetingMessage({
      name: request.name,
      style: request.style,
      loud: request.loud,
      emoji: request.emoji,
      language: request.language,
    }),
    ok: true,
  }
}