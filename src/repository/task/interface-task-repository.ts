import { TaskEntity } from '../../domain/entities/task';

export interface ITaskRepository {
	findManyByUserId(userId: string): Promise<TaskEntity[]>;
	create(taskEntity: TaskEntity): Promise<TaskEntity>;
	findById(taskId: string): Promise<TaskEntity>;
	create(taskEntity: TaskEntity): Promise<TaskEntity>;
	update(taskEntity: TaskEntity): Promise<TaskEntity>;
	delete(taskId: string): Promise<void>;
}