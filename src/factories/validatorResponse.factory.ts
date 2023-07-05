import { ValidatorErrors } from '../contracts/validatorResponse.js';

export abstract class ValidatorResponseFactory {
  static create(errors: ValidatorErrors = {}) {
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  }
}
