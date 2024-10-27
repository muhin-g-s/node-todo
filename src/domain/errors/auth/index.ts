export const enum AuthServiceError {
	UnknownError,
	NotFoundUser,
	PasswordNotCompare,
}

export const enum AuthUseCaseError {
	UnknownError,
	NotFoundUser,
	PasswordNotCompare,
	AlreadyExist,
	PasswordTooSimple,
}