export interface ValidatorResponse {
  isValid: boolean;
  errors?: ValidatorErrors;
}

export type ValidatorErrors = { [key: string]: string };
