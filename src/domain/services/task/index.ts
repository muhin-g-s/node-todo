import { TaskEntity } from '@/domain/entities/task';
interface ITaskRepository {
	findManyByUserId(userId: string): Promise<TaskEntity[]>;
	create(taskEntity: TaskEntity): Promise<TaskEntity>;
	findById(taskId: string): Promise<TaskEntity | null>;
	create(taskEntity: TaskEntity): Promise<TaskEntity>;
	update(taskEntity: TaskEntity): Promise<TaskEntity>;
	delete(taskId: string): Promise<void>;
}

export class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

  create(taskEntity: TaskEntity): Promise<TaskEntity> {
    return this.taskRepository.create(taskEntity);
  }

	async update(taskEntity: TaskEntity, userId: string): Promise<TaskEntity> {
		const task = await this.getById(taskEntity.id ?? '', userId);

		if(this.checkBelongingTaskToUser(task, userId)) {
			throw new Error('task not belonging user');
		}

    return this.taskRepository.update(taskEntity);
  }

  async getById(taskId: string, userId: string): Promise<TaskEntity | null> {
		const task = await this.taskRepository.findById(taskId);

		if(this.checkBelongingTaskToUser(task, userId)) {
			throw new Error('task not belonging user');
		}

		return task;
  }

	getAll(userId: string): Promise<TaskEntity[]> {
		return this.taskRepository.findManyByUserId(userId);
	}

	async getNotCompleted(userId: string): Promise<TaskEntity[]> {
		const tasks = await this.taskRepository.findManyByUserId(userId);

		return tasks.filter(el => !el.isCompleted);
	}

	async getCompleted(userId: string): Promise<TaskEntity[]> {
		const tasks = await this.taskRepository.findManyByUserId(userId);

		return tasks.filter(el => el.isCompleted);
	}

  async delete(taskId: string, userId: string): Promise<void> {
		const task = await this.getById(taskId, userId);

		if(this.checkBelongingTaskToUser(task, userId)) {
			throw new Error('task not belonging user');
		}

    await this.taskRepository.delete(taskId);
  }

	private checkBelongingTaskToUser(taskEntity: TaskEntity | null, userId: string): boolean {
		return !!taskEntity && (taskEntity.id === userId);
	}
}