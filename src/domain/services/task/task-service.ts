import { TaskEntity } from '../../../domain/entities/task';
import { ITaskRepository } from '../../../repository/task';


export class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

  create(taskEntity: TaskEntity): Promise<TaskEntity> {
    return this.taskRepository.create(taskEntity);
  }

	update(taskEntity: TaskEntity): Promise<TaskEntity> {
    return this.taskRepository.update(taskEntity);
  }

  getById(taskId: string): Promise<TaskEntity> {
    return this.taskRepository.findById(taskId);
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

  async delete(taskId: string): Promise<void> {
    await this.taskRepository.delete(taskId);
  }
}