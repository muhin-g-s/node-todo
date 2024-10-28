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

export const enum TaskUseCaseError {
	UnknownError,
	NotFoundTask,
	NotBelongingUser,
}