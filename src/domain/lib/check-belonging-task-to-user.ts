import { TaskEntity } from '../../domain/entities/task';

export function checkBelongingTaskToUser(taskEntity: TaskEntity, userId: string): boolean {
	return taskEntity.id === userId;
}