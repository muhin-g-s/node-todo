export const enum TaskRepositoryError {
	UnknownError,
	NotFoundTask,
}

export type TaskRepositorySaveError = TaskRepositoryError.UnknownError;
export type TaskRepositoryFindManyError = TaskRepositoryError.UnknownError;
export type TaskRepositoryFindError = TaskRepositoryError.UnknownError | TaskRepositoryError.NotFoundTask;
export type TaskRepositoryUpdateError = TaskRepositoryError.UnknownError;
export type TaskRepositoryDeleteError = TaskRepositoryError.UnknownError;

export const enum TaskServiceError {
	UnknownError,
	NotFoundTask,
	NotBelongingUser,
}

export type TaskServiceSaveError = TaskServiceError.UnknownError;
export type TaskServiceGetError = TaskServiceError.UnknownError | TaskServiceError.NotFoundTask | TaskServiceError.NotBelongingUser;
export type TaskServiceGetManyError = TaskServiceError.UnknownError;
export type TaskServiceUpdateError = TaskServiceError.UnknownError | TaskServiceError.NotFoundTask | TaskServiceError.NotBelongingUser;
export type TaskServiceDeleteError = TaskServiceError.UnknownError | TaskServiceError.NotFoundTask | TaskServiceError.NotBelongingUser;

export const enum TaskUseCaseError {
	UnknownError,
	NotFoundTask,
	NotBelongingUser,
}

export type TaskUseCaseSaveError = TaskUseCaseError.UnknownError;
export type TaskUseCaseGetError = TaskUseCaseError.UnknownError | TaskUseCaseError.NotFoundTask | TaskUseCaseError.NotBelongingUser;
export type TaskUseCaseGetManyError = TaskUseCaseError.UnknownError;
export type TaskUseCaseUpdateError = TaskUseCaseError.UnknownError | TaskUseCaseError.NotFoundTask | TaskUseCaseError.NotBelongingUser;
export type TaskUseCaseDeleteError = TaskUseCaseError.UnknownError | TaskUseCaseError.NotFoundTask | TaskUseCaseError.NotBelongingUser;
