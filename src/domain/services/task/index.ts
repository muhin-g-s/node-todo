import { CreateTask, FindTask, Task, UpdateTask } from '@/domain/entities/task';

interface ITaskRepository {
	findManyByUserId(userId: string): Promise<Task[]>;
	save(task: CreateTask): Promise<Task>;
	findById(taskId: string): Promise<Task>;
	update(task: UpdateTask): Promise<Task>;
	delete(taskId: string): Promise<void>;
}

export class TaskService {
	constructor(private taskRepository: ITaskRepository) { }

	create(task: CreateTask): Promise<Task> {
		return this.taskRepository.save(task);
	}

	async update(task: UpdateTask): Promise<Task> {
		const existedTask = await this.getById(task);

		if (this.checkBelongingTaskToUser(existedTask.userId, task.userId)) {
			throw new Error('task not belonging user');
		}

		if (task.description) {
			existedTask.description = task.description;
		}

		if (task.isCompleted) {
			existedTask.isCompleted = task.isCompleted;
		}

		if (task.title) {
			existedTask.title = task.title;
		}

		return this.taskRepository.update(existedTask);
	}

	async getById({ id, userId }: FindTask): Promise<Task> {
		const existedTask = await this.taskRepository.findById(id);

		if (this.checkBelongingTaskToUser(existedTask.userId, userId)) {
			throw new Error('task not belonging user');
		}

		return existedTask;
	}

	getAll(userId: string): Promise<Task[]> {
		return this.taskRepository.findManyByUserId(userId);
	}

	async getNotCompleted(userId: string): Promise<Task[]> {
		const tasks = await this.taskRepository.findManyByUserId(userId);

		return tasks.filter(el => !el.isCompleted);
	}

	async getCompleted(userId: string): Promise<Task[]> {
		const tasks = await this.taskRepository.findManyByUserId(userId);

		return tasks.filter(el => el.isCompleted);
	}

	async delete({ id, userId }: FindTask): Promise<Task> {
		const existedTask = await this.taskRepository.findById(id);

		if (this.checkBelongingTaskToUser(existedTask.userId, userId)) {
			throw new Error('task not belonging user');
		}

		await this.taskRepository.delete(id);

		return existedTask;
	}

	private checkBelongingTaskToUser(taskId: string, userId: string): boolean {
		return taskId === userId;
	}
}