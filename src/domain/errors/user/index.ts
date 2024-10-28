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

export type UserServiceCreateError = UserServiceError.UnknownError | UserServiceError.AlreadyExist | UserServiceError.PasswordTooSimple;
export type UserServiceFindError = UserServiceError.UnknownError | UserServiceError.NotFoundUser;
export type UserServiceDeleteError = UserServiceError.UnknownError | UserServiceError.NotFoundUser;
export type UserServiceUpdateError = UserServiceError.UnknownError | UserServiceError.NotFoundUser | UserServiceError.PasswordTooSimple;

export enum UserUseCaseError {
	UnknownError,
	NotFoundUser,
	PasswordTooSimple,
}
