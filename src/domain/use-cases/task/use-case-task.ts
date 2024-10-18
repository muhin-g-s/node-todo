import { checkBelongingTaskToUser } from '@/domain/lib';
import { TaskService } from '@/domain/services/task';
import { TaskEntity } from '@/domain/entities/task';

export class UseCaseTask {
	constructor(private taskService: TaskService) {}

	async getTask(taskId: string, userId: string): Promise<TaskEntity>{
		const task = await this.taskService.getById(taskId);

		if(checkBelongingTaskToUser(task, userId)) {
			throw new Error('task not belonging user');
		}

		return task;
	}

	async updateTask(taskEntity: TaskEntity, userId: string): Promise<TaskEntity>{
		const task = await this.taskService.getById(taskEntity.id);

		if(checkBelongingTaskToUser(task, userId)) {
			throw new Error('task not belonging user');
		}

		return this.taskService.update(taskEntity);
	}

	async deleteTask(taskId: string, userId: string): Promise<void> {
		const task = await this.taskService.getById(taskId);

		if(checkBelongingTaskToUser(task, userId)) {
			throw new Error('task not belonging user');
		}

		await this.taskService.delete(taskId);
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