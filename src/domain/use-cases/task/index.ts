import { CreateTask, FindTask, Task, UpdateTask } from '@/domain/entities/task';
import { TaskServiceError, TaskUseCaseError } from '@/domain/errors/task';
import { Either, ErrorResult, Result } from '@/lib';

interface ITaskService {
	getById(task: FindTask): Promise<Either<TaskServiceError, Task>>;
	update(task: UpdateTask): Promise<Either<TaskServiceError, Task>>;
	delete(task: FindTask): Promise<Either<TaskServiceError, Task>>;
	create(task: CreateTask): Promise<Either<TaskServiceError, Task>>;
	getAll(userId: string): Promise<Either<TaskServiceError, Task[]>>;
	getNotCompleted(userId: string): Promise<Either<TaskServiceError, Task[]>>;
	getCompleted(userId: string): Promise<Either<TaskServiceError, Task[]>>;
}

export class UseCaseTask {
	constructor(private taskService: ITaskService) { }

	async getTask(task: FindTask): Promise<Either<TaskUseCaseError, Task>> {
		const taskResult = await this.taskService.getById(task);

		if (taskResult.isError()) {
			const { error } = taskResult;

			switch (error) {
				case TaskServiceError.UnknownError: return ErrorResult.create(TaskUseCaseError.UnknownError);
				case TaskServiceError.NotFoundTask: return ErrorResult.create(TaskUseCaseError.NotFoundTask);
				case TaskServiceError.NotBelongingUser: return ErrorResult.create(TaskUseCaseError.NotBelongingUser);
				default: return ErrorResult.create(TaskUseCaseError.UnknownError);
			}
		}

		return Result.create(taskResult.value);
	}

	async updateTask(task: UpdateTask): Promise<Either<TaskUseCaseError, Task>> {
		const taskResult = await this.taskService.update(task);

		if (taskResult.isError()) {
			const { error } = taskResult;

			switch (error) {
				case TaskServiceError.UnknownError: return ErrorResult.create(TaskUseCaseError.UnknownError);
				case TaskServiceError.NotFoundTask: return ErrorResult.create(TaskUseCaseError.NotFoundTask);
				case TaskServiceError.NotBelongingUser: return ErrorResult.create(TaskUseCaseError.NotBelongingUser);
				default: return ErrorResult.create(TaskUseCaseError.UnknownError);
			}
		}

		return Result.create(taskResult.value);
	}

	async deleteTask(task: FindTask): Promise<Either<TaskUseCaseError, Task>> {
		const taskResult = await this.taskService.delete(task);

		if (taskResult.isError()) {
			const { error } = taskResult;

			switch (error) {
				case TaskServiceError.UnknownError: return ErrorResult.create(TaskUseCaseError.UnknownError);
				case TaskServiceError.NotFoundTask: return ErrorResult.create(TaskUseCaseError.NotFoundTask);
				case TaskServiceError.NotBelongingUser: return ErrorResult.create(TaskUseCaseError.NotBelongingUser);
				default: return ErrorResult.create(TaskUseCaseError.UnknownError);
			}
		}

		return Result.create(taskResult.value);
	}

	async create(task: CreateTask): Promise<Either<TaskUseCaseError, Task>> {
		const taskResult = await this.taskService.create(task);

		if (taskResult.isError()) {
			const { error } = taskResult;

			switch (error) {
				case TaskServiceError.UnknownError: return ErrorResult.create(TaskUseCaseError.UnknownError);
				case TaskServiceError.NotFoundTask: return ErrorResult.create(TaskUseCaseError.NotFoundTask);
				default: return ErrorResult.create(TaskUseCaseError.UnknownError);
			}
		}

		return Result.create(taskResult.value);
	}

	async getAll(userId: string): Promise<Either<TaskUseCaseError, Task[]>> {
		const tasksResult = await this.taskService.getAll(userId);

		if (tasksResult.isError()) {
			const { error } = tasksResult;

			switch (error) {
				case TaskServiceError.UnknownError: return ErrorResult.create(TaskUseCaseError.UnknownError);
				default: return ErrorResult.create(TaskUseCaseError.UnknownError);
			}
		}

		return Result.create(tasksResult.value);
	}

	async getNotCompleted(userId: string): Promise<Either<TaskUseCaseError, Task[]>> {
		const tasksResult = await this.taskService.getNotCompleted(userId);

		if (tasksResult.isError()) {
			const { error } = tasksResult;

			switch (error) {
				case TaskServiceError.UnknownError: return ErrorResult.create(TaskUseCaseError.UnknownError);
				default: return ErrorResult.create(TaskUseCaseError.UnknownError);
			}
		}

		return Result.create(tasksResult.value);
	}

	async getCompleted(userId: string): Promise<Either<TaskUseCaseError, Task[]>> {
		const tasksResult = await this.taskService.getCompleted(userId);

		if (tasksResult.isError()) {
			const { error } = tasksResult;

			switch (error) {
				case TaskServiceError.UnknownError: return ErrorResult.create(TaskUseCaseError.UnknownError);
				default: return ErrorResult.create(TaskUseCaseError.UnknownError);
			}
		}

		return Result.create(tasksResult.value);
	}
}