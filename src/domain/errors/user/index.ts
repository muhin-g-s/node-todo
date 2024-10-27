export const enum UserRepositoryError {
	UnknownError,
	NotFoundUser,
}

export enum UserServiceError {
	UnknownError,
	NotFoundUser,
	AlreadyExist,
	PasswordTooSimple,
}