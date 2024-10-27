import { CreateTask, FindTask, Task, UpdateTask } from '@/domain/entities/task';
import { Either, ErrorResult, Result } from '@/lib';

const enum RepositoryError {
	UnknownError,
	NotFoundTask,
}

const enum ServiceError {
	UnknownError,
	NotFoundTask,
	NotBelongingUser,
}

interface ITaskRepository {
	findManyByUserId(userId: string): Promise<Either<RepositoryError, Task[]>>;
	save(task: CreateTask): Promise<Either<RepositoryError, Task>>;
	findById(taskId: string): Promise<Either<RepositoryError, Task>>;
	update(task: UpdateTask): Promise<Either<RepositoryError, Task>>;
	delete(taskId: string): Promise<Either<RepositoryError, void>>;
}

export class TaskService {
	constructor(private taskRepository: ITaskRepository) { }

	async create(task: CreateTask): Promise<Either<ServiceError, Task>> {
		const createdTaskResult = await this.taskRepository.save(task);

		return createdTaskResult.isError()
			? ErrorResult.create(ServiceError.UnknownError)
			: Result.create(createdTaskResult.value);
	}

	async update(task: UpdateTask): Promise<Either<ServiceError, Task>> {
		const foundTaskResult = await this.getById(task);

		if (foundTaskResult.isError()) {
			return ErrorResult.create(foundTaskResult.error);
		}

		const foundTask = foundTaskResult.value;

		if (task.description) {
			foundTask.description = task.description;
		}

		if (task.isCompleted) {
			foundTask.isCompleted = task.isCompleted;
		}

		if (task.title) {
			foundTask.title = task.title;
		}

		const updateTaskResult = await this.taskRepository.update(foundTask);

		return updateTaskResult.isError()
			? ErrorResult.create(ServiceError.UnknownError)
			: Result.create(updateTaskResult.value);
	}

	async getById({ id, userId }: FindTask): Promise<Either<ServiceError, Task>> {
		const foundTaskResult = await this.taskRepository.findById(id);

		if (foundTaskResult.isError()) {
			const { error } = foundTaskResult;

			switch (error) {
				case RepositoryError.UnknownError: return ErrorResult.create(ServiceError.UnknownError);
				case RepositoryError.NotFoundTask: return ErrorResult.create(ServiceError.NotFoundTask);
				default: return ErrorResult.create(ServiceError.UnknownError);
			}
		}

		const foundTask = foundTaskResult.value;

		return this.checkBelongingTaskToUser(foundTask.userId, userId)
			? Result.create(foundTask)
			: ErrorResult.create(ServiceError.NotBelongingUser);
	}

	async getAll(userId: string): Promise<Either<ServiceError, Task[]>> {
		const foundTasksResult = await this.taskRepository.findManyByUserId(userId);

		return foundTasksResult.isError()
			? ErrorResult.create(ServiceError.UnknownError)
			: Result.create(foundTasksResult.value);
	}

	async getNotCompleted(userId: string): Promise<Either<ServiceError, Task[]>> {
		const foundTasksResult = await this.taskRepository.findManyByUserId(userId);

		return foundTasksResult.isError()
			? ErrorResult.create(ServiceError.UnknownError)
			: Result.create(foundTasksResult.value.filter(el => !el.isCompleted));
	}

	async getCompleted(userId: string): Promise<Either<ServiceError, Task[]>> {
		const foundTasksResult = await this.taskRepository.findManyByUserId(userId);

		return foundTasksResult.isError()
			? ErrorResult.create(ServiceError.UnknownError)
			: Result.create(foundTasksResult.value.filter(el => el.isCompleted));
	}

	async delete(task: FindTask): Promise<Either<ServiceError, Task>> {
		const foundTaskResult = await this.getById(task);

		if (foundTaskResult.isError()) {
			return ErrorResult.create(foundTaskResult.error);
		}

		const deleteTaskResult = await this.taskRepository.delete(task.id);

		return deleteTaskResult.isError()
			? ErrorResult.create(ServiceError.UnknownError)
			: Result.create(foundTaskResult.value)
	}

	private checkBelongingTaskToUser(supposedUserId: string, userId: string): boolean {
		return supposedUserId === userId;
	}
}