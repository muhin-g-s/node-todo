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