export const enum UserRepositoryError {
	UnknownError,
	NotFoundUser,
}

export type UserRepositorySaveError = UserRepositoryError.UnknownError;
export type UserRepositoryFindError = UserRepositoryError.UnknownError | UserRepositoryError.NotFoundUser;
export type UserRepositoryUpdateError = UserRepositoryError.UnknownError;
export type UserRepositoryDeleteError = UserRepositoryError.UnknownError;

export enum UserServiceError {
	UnknownError,
	NotFoundUser,
	AlreadyExist,
	PasswordTooSimple,
}

export enum UserUseCaseError {
	UnknownError,
	NotFoundUser,
	PasswordTooSimple,
}
