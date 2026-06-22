import { getDayPeriod } from "../utils/time"

export const SUPPORTED_STYLES = ["formal", "casual", "time"] as const
export const SUPPORTED_LANGUAGES = ["es", "fr", "de", "jp", "default"] as const

export type GreetingStyle = (typeof SUPPORTED_STYLES)[number]
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]

export type GreetOptions = {
  loud?: boolean
  emoji?: boolean
  language?: LanguageCode
}

export type Response<T = void> = {
  isError: boolean
  message?: string
  data?: T
}

export type BuildGreetingInput = {
  name: string
  style: GreetingStyle
  loud?: boolean
  emoji?: boolean
  language?: LanguageCode
  now?: Date
}

export class GreetingService {
  readonly greetingsInLanguages: Record<LanguageCode, string> = {
    es: "¡Hola",
    fr: "Bonjour",
    de: "Guten Tag",
    jp: "こんにちは",
    default: "Hello",
  }

  buildGreeting(input: BuildGreetingInput): string {
    const base = this.buildBaseGreeting(input)
    return base
  }

  private buildBaseGreeting(input: BuildGreetingInput): string {
    switch (input.style) {
      case "formal": {
        return this.buildFormalGreeting(input)
      }
      case "casual": {
        return this.buildCasualGreeting(input)
      }
      case "time": {
        return this.buildTimeBasedGreeting(input)
      }
      default: {
        return `Hello, ${input.name}!`
      }
    }
  }

  private buildFormalGreeting(input: BuildGreetingInput): string {
    let myGreeting = `Good day, ${input.name}. It is a pleasure to make your acquaintance.`

    if (input.language && input.language !== "default") {
      const greetingInLanguage = this.greetingsInLanguages[input.language]
      myGreeting = `${greetingInLanguage}, ${input.name}!`
    }

    if (input.emoji) {
      myGreeting = `🎩 ${myGreeting}`
    }

    if (input.loud) {
      myGreeting = myGreeting.toUpperCase()
    }

    return myGreeting
  }

  private buildCasualGreeting(input: BuildGreetingInput): string {
    let greeting = `Hey ${input.name}!`

    if (input.language && input.language !== "default") {
      const greetingInLanguage = this.greetingsInLanguages[input.language]
      greeting = `${greetingInLanguage}, ${input.name}!`
    }

    if (input.emoji) {
      greeting = `👋 ${greeting}`
    }

    if (input.loud) {
      greeting = greeting.toUpperCase()
    }

    return greeting
  }

  private buildTimeBasedGreeting(input: BuildGreetingInput): string {
    const partOfDay = getDayPeriod(input.now ?? new Date())
    let greeting = `${partOfDay}, ${input.name}!`

    if (input.language && input.language !== "default") {
      const greetingInLanguage = this.greetingsInLanguages[input.language]
      greeting = `${greetingInLanguage}, ${input.name}!`
    }

    if (input.emoji) {
      greeting = `⏰ ${greeting}`
    }

    if (input.loud) {
      greeting = greeting.toUpperCase()
    }

    return greeting
  }
}
