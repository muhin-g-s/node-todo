export const enum AuthServiceError {
	UnknownError,
	NotFoundUser,
	PasswordNotCompare,
}

export type AuthServiceLoginError = AuthServiceError.NotFoundUser | AuthServiceError.PasswordNotCompare | AuthServiceError.UnknownError;

export const enum AuthUseCaseError {
	UnknownError,
	NotFoundUser,
	PasswordNotCompare,
	AlreadyExist,
	PasswordTooSimple,
}

export type AuthUseCaseRegisterError = AuthUseCaseError.PasswordTooSimple | AuthUseCaseError.AlreadyExist | AuthUseCaseError.UnknownError;
export type AuthUseCaseLoginError = AuthUseCaseError.NotFoundUser | AuthUseCaseError.PasswordNotCompare | AuthUseCaseError.UnknownError;