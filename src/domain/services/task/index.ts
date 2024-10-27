import { CreateTask, FindTask, Task, UpdateTask } from '@/domain/entities/task';
import { TaskRepositoryError, TaskServiceError } from '@/domain/errors/task';
import { Either, ErrorResult, Result } from '@/lib';

interface ITaskRepository {
	findManyByUserId(userId: string): Promise<Either<TaskRepositoryError, Task[]>>;
	save(task: CreateTask): Promise<Either<TaskRepositoryError, Task>>;
	findById(taskId: string): Promise<Either<TaskRepositoryError, Task>>;
	update(task: UpdateTask): Promise<Either<TaskRepositoryError, Task>>;
	delete(taskId: string): Promise<Either<TaskRepositoryError, void>>;
}

export class TaskService {
	constructor(private taskRepository: ITaskRepository) { }

	async create(task: CreateTask): Promise<Either<TaskServiceError, Task>> {
		const createdTaskResult = await this.taskRepository.save(task);

		return createdTaskResult.isError()
			? ErrorResult.create(TaskServiceError.UnknownError)
			: Result.create(createdTaskResult.value);
	}

	async update(task: UpdateTask): Promise<Either<TaskServiceError, Task>> {
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
			? ErrorResult.create(TaskServiceError.UnknownError)
			: Result.create(updateTaskResult.value);
	}

	async getById({ id, userId }: FindTask): Promise<Either<TaskServiceError, Task>> {
		const foundTaskResult = await this.taskRepository.findById(id);

		if (foundTaskResult.isError()) {
			const { error } = foundTaskResult;

			switch (error) {
				case TaskRepositoryError.UnknownError: return ErrorResult.create(TaskServiceError.UnknownError);
				case TaskRepositoryError.NotFoundTask: return ErrorResult.create(TaskServiceError.NotFoundTask);
				default: return ErrorResult.create(TaskServiceError.UnknownError);
			}
		}

		const foundTask = foundTaskResult.value;

		return this.checkBelongingTaskToUser(foundTask.userId, userId)
			? Result.create(foundTask)
			: ErrorResult.create(TaskServiceError.NotBelongingUser);
	}

	async getAll(userId: string): Promise<Either<TaskServiceError, Task[]>> {
		const foundTasksResult = await this.taskRepository.findManyByUserId(userId);

		return foundTasksResult.isError()
			? ErrorResult.create(TaskServiceError.UnknownError)
			: Result.create(foundTasksResult.value);
	}

	async getNotCompleted(userId: string): Promise<Either<TaskServiceError, Task[]>> {
		const foundTasksResult = await this.taskRepository.findManyByUserId(userId);

		return foundTasksResult.isError()
			? ErrorResult.create(TaskServiceError.UnknownError)
			: Result.create(foundTasksResult.value.filter(el => !el.isCompleted));
	}

	async getCompleted(userId: string): Promise<Either<TaskServiceError, Task[]>> {
		const foundTasksResult = await this.taskRepository.findManyByUserId(userId);

		return foundTasksResult.isError()
			? ErrorResult.create(TaskServiceError.UnknownError)
			: Result.create(foundTasksResult.value.filter(el => el.isCompleted));
	}

	async delete(task: FindTask): Promise<Either<TaskServiceError, Task>> {
		const foundTaskResult = await this.getById(task);

		if (foundTaskResult.isError()) {
			return ErrorResult.create(foundTaskResult.error);
		}

		const deleteTaskResult = await this.taskRepository.delete(task.id);

		return deleteTaskResult.isError()
			? ErrorResult.create(TaskServiceError.UnknownError)
			: Result.create(foundTaskResult.value)
	}

	private checkBelongingTaskToUser(supposedUserId: string, userId: string): boolean {
		return supposedUserId === userId;
	}
}