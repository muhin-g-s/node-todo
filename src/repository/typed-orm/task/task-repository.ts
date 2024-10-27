import { EntityManager, Repository } from 'typeorm';
import { CreateTask, Task as TaskEntity } from '@/domain/entities/task';
import { Either, ErrorResult, Result } from '@/lib';
import { TaskRepositoryError } from '@/domain/errors/task';
import { Task } from './model';

export class TaskRepository {
	private repository: Repository<Task>;

	constructor(entityManager: EntityManager) {
		this.repository = entityManager.getRepository(Task);
	}

	async save(task: CreateTask): Promise<Either<TaskRepositoryError, TaskEntity>> {
		try {
			const taskResult = await this.repository.save(task);
			return Result.create(taskResult);
		} catch {
			return ErrorResult.create(TaskRepositoryError.UnknownError);
		}
	}

	async findManyByUserId(userId: string): Promise<Either<TaskRepositoryError, TaskEntity[]>> {
		try {
			const tasksResult = await this.repository.findBy({ userId });
			return Result.create(tasksResult);
		} catch {
			return ErrorResult.create(TaskRepositoryError.UnknownError);
		}
	}

	async findById(taskId: string): Promise<Either<TaskRepositoryError, TaskEntity>> {
		try {
			const taskResult = await this.repository.findOneBy({ id: taskId });

			if (!taskResult) {
				return ErrorResult.create(TaskRepositoryError.NotFoundTask);
			}

			return Result.create(taskResult);
		} catch {
			return ErrorResult.create(TaskRepositoryError.UnknownError);
		}
	}

	async update(taskEntity: TaskEntity): Promise<Either<TaskRepositoryError, TaskEntity>> {
		try {
			const taskResult = await this.repository.save(taskEntity);

			return Result.create(taskResult);
		} catch {
			return ErrorResult.create(TaskRepositoryError.UnknownError);
		}
	}

	async delete(taskId: string): Promise<Either<TaskRepositoryError, void>> {
		try {
			await this.repository.delete({ id: taskId });

			return Result.create(undefined);
		} catch {
			return ErrorResult.create(TaskRepositoryError.UnknownError);
		}
	}
}