import { EntityManager, Repository } from 'typeorm';
import { TaskEntity } from '@/domain/entities/task';
import { ITaskRepository } from '@/repository/task';
import { Task } from './dto';

export class TaskRepository implements ITaskRepository {
	private repository: Repository<Task>;

	constructor(private entityManager: EntityManager){
		this.repository = entityManager.getRepository(Task);
	}

	findManyByUserId(userId: string): Promise<TaskEntity[]> {
		return this.repository.findBy({userId});
	}

	create(taskEntity: TaskEntity): Promise<TaskEntity>{
		return this.repository.save(taskEntity);
	}

	findById(taskId: string): Promise<TaskEntity> {
		return this.repository.findOneBy({id: taskId});
	}

	update(taskEntity: TaskEntity): Promise<TaskEntity> {
		return this.repository.save(taskEntity);
	}

	async delete(taskId: string): Promise<void> {
		await this.repository.delete({id: taskId});
	}
}