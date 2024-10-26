import { CreateTask, FindTask, Task, UpdateTask } from '@/domain/entities/task';

interface ITaskService {
	getById({ id, userId }: FindTask): Promise<Task>;
	update(task: UpdateTask): Promise<Task>;
	delete({ id, userId }: FindTask): Promise<Task>;
	create(task: CreateTask): Promise<Task>;
	getAll(userId: string): Promise<Task[]>;
	getNotCompleted(userId: string): Promise<Task[]>;
	getCompleted(userId: string): Promise<Task[]>;
}

export class UseCaseTask {
	constructor(private taskService: ITaskService) { }

	getTask(task: FindTask): Promise<Task> {
		return this.taskService.getById(task);
	}

	updateTask(task: UpdateTask): Promise<Task> {
		return this.taskService.update(task);
	}

	deleteTask(task: FindTask): Promise<Task> {
		return this.taskService.delete(task);
	}

	create(task: CreateTask): Promise<Task> {
		return this.taskService.create(task);
	}

	getAll(userId: string): Promise<Task[]> {
		return this.taskService.getAll(userId);
	}

	getNotCompleted(userId: string): Promise<Task[]> {
		return this.taskService.getNotCompleted(userId);
	}

	getCompleted(userId: string): Promise<Task[]> {
		return this.taskService.getCompleted(userId);
	}
}