export class SystemError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SystemError"
  }
}

export class ContentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ContentError"
  }
}

export class DuplicityError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "DuplicityError"
  }
}

export class MatchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MatchError"
  }
}

export const errors = {
  SystemError,
  ContentError,
  DuplicityError,
  MatchError,
  TypeError,
  RangeError,
}

export type AppErrorName = keyof typeof errors

export default errors
