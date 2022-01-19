export default class BusinessError extends Error {
  public code: string | number

  constructor(code: string | number, message: string) {
    super()
    this.code = code
    this.message = message
  }
}
