
export interface IAccountInfo {
  user: string,
  name: string,
  email: string,
  emailConfirmed: boolean
}

export interface IOperationResult {
  correlationId: string,
  success: boolean,
  error?: any
}
