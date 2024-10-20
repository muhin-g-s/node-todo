import { TaskService } from '@/domain/services/task';
import { TaskEntity } from '@/domain/entities/task';

export class UseCaseTask {
	constructor(private taskService: TaskService) {}

	getTask(taskId: string, userId: string): Promise<TaskEntity | null>{
		return this.taskService.getById(taskId, userId);
	}

	updateTask(taskEntity: TaskEntity, userId: string): Promise<TaskEntity>{
		return this.taskService.update(taskEntity, userId);
	}

	async deleteTask(taskId: string, userId: string): Promise<void> {
		await this.taskService.delete(taskId, userId);
	}

	create(taskEntity: TaskEntity): Promise<TaskEntity> {
		return this.taskService.create(taskEntity);
	}

	getAll(userId: string): Promise<TaskEntity[]> {
		return this.taskService.getAll(userId);
	} 

	getNotCompleted(userId: string): Promise<TaskEntity[]> {
		return this.taskService.getNotCompleted(userId);
	} 

	getCompleted(userId: string): Promise<TaskEntity[]> {
		return this.taskService.getCompleted(userId);
	} 
}