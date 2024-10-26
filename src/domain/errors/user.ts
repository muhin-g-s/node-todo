import { BusinessLogicError } from './base';

export const enum UserOperationErrorMessages {
	PasswordTooSimple = 'Password too simple',
	UserNotExist = 'User not exist', 
	PasswordNotCompare = 'Password not compare',
	AlreadyExist = 'User already exist',
}

export class UserOperationError extends BusinessLogicError {
	constructor(message: UserOperationErrorMessages) {
		super(message);
	}
}