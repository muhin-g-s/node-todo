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
export type TaskServiceFindManyError = TaskServiceError.UnknownError;
export type TaskServiceGetError = TaskServiceError.UnknownError | TaskServiceError.NotFoundTask | TaskServiceError.NotBelongingUser;
export type TaskServiceGetManyError = TaskServiceError.UnknownError;
export type TaskServiceUpdateError = TaskServiceError.UnknownError | TaskServiceError.NotFoundTask | TaskServiceError.NotBelongingUser;
export type TaskServiceDeleteError = TaskServiceError.UnknownError;

export const enum TaskUseCaseError {
	UnknownError,
	NotFoundTask,
	NotBelongingUser,
}