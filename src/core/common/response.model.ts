export enum StatusCode {
  SUCCESS = 0,
  GENERAL_ERROR = 1,
  INVALID_ARGUMENTS = 2,
  COMMAND_NOT_EXECUTABLE = 126,
  COMMAND_NOT_FOUND = 127,
  INTERRUPTED = 130,
  KILLED = 137,
  TERMINATED = 143,
}

export class Response<T = any> {
  status: number
  message: string
  data: T

  constructor(status: number, message: string, data: any = null) {
    this.status = status
    this.message = message
    this.data = data
  }

  get isSuccess(): boolean {
    return this.status === StatusCode.SUCCESS
  }

  get isError(): boolean {
    return this.status !== StatusCode.SUCCESS
  }

  get isInvalidArguments(): boolean {
    return this.status === StatusCode.INVALID_ARGUMENTS
  }

  print(): void {
    if (this.isSuccess) {
      console.log(this.message)
    } else {
      console.error(`Error (${this.status}): ${this.message}`)
    }
  }

  static success(message: string = '', data: any = null): Response {
    return new Response(StatusCode.SUCCESS, message, data)
  }

  static error(message: string, data: any = null): Response {
    return new Response(StatusCode.GENERAL_ERROR, message, data)
  }

  static invalidArguments(message: string, data: any = null): Response {
    return new Response(StatusCode.INVALID_ARGUMENTS, message, data)
  }

  static commandNotExecutable(message: string, data: any = null): Response {
    return new Response(StatusCode.COMMAND_NOT_EXECUTABLE, message, data)
  }

  static commandNotFound(message: string, data: any = null): Response {
    return new Response(StatusCode.COMMAND_NOT_FOUND, message, data)
  }

  static interrupted(message: string, data: any = null): Response {
    return new Response(StatusCode.INTERRUPTED, message, data)
  }

  static killed(message: string, data: any = null): Response {
    return new Response(StatusCode.KILLED, message, data)
  }

  static terminated(message: string, data: any = null): Response {
    return new Response(StatusCode.TERMINATED, message, data)
  }
}
