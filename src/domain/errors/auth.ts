import { BusinessLogicError } from './base';

export const enum AuthOperationErrorMessages {
	AlreadyExist = 'User already exist',
}

export class AuthOperationError extends BusinessLogicError {
	constructor(message: AuthOperationErrorMessages) {
		super(message);
	}
}