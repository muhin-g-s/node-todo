import { EntityManager, Repository } from 'typeorm';
import { TaskEntity } from '@/domain/entities/task';
import { Task } from './dto';

export class TaskRepository {
	private repository: Repository<Task>;

	constructor(private entityManager: EntityManager){
		this.repository = entityManager.getRepository(Task);
	}

	findManyByUserId(userId: string): Promise<TaskEntity[]> {
		return this.repository.findBy({userId});
	}

	create(taskEntity: TaskEntity): Promise<TaskEntity>{
		return this.repository.save(this.mapUserEntity(taskEntity));
	}

	findById(taskId: string): Promise<TaskEntity | null> {
		return this.repository.findOneBy({id: taskId});
	}

	update(taskEntity: TaskEntity): Promise<TaskEntity> {
		return this.repository.save(this.mapUserEntity(taskEntity));
	}

	async delete(taskId: string): Promise<void> {
		await this.repository.delete({id: taskId});
	}

	private mapUserEntity(taskEntity: TaskEntity): Task {

		const taskDto = new Task();

		if(taskEntity.id) {
			taskEntity.id = taskEntity.id
		}

		taskDto.description = taskEntity.description;
		taskDto.title = taskEntity.title;
		taskDto.userId = taskEntity.userId;
		taskDto.isCompleted = taskEntity.isCompleted;
		
		return taskDto;
	}
}