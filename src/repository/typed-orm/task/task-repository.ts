import { EntityManager, Repository } from 'typeorm';
import { CreateTask, Task as TaskEntity } from '@/domain/entities/task';
import { Task } from './model';

export class TaskRepository {
	private repository: Repository<Task>;

	constructor(entityManager: EntityManager) {
		this.repository = entityManager.getRepository(Task);
	}

	save(task: CreateTask): Promise<TaskEntity> {
		return this.repository.save(task);
	}

	findManyByUserId(userId: string): Promise<TaskEntity[]> {
		return this.repository.findBy({ userId });
	}

	async findById(taskId: string): Promise<TaskEntity> {
		const task = await this.repository.findOneBy({ id: taskId })

		if (!task) {
			throw new Error('error');
		}

		return task;
	}

	update(taskEntity: TaskEntity): Promise<TaskEntity> {
		return this.repository.save(taskEntity);
	}

	async delete(taskId: string): Promise<void> {
		await this.repository.delete({ id: taskId });
	}
}